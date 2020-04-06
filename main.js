describe('test my todo list', function () {
    let page;
    let todoList;
    let todoListLength;

    before (async function () {
      page = await browser.newPage();
      await page.goto('http://127.0.0.1:7001/');
    });
  
    after (async function () {
      await page.close();
    });
    
    // 添加新的待办事项
    it('should new todo correct', async function() {
      await page.click('#new-todo', {delay: 500}); 
      await page.type('#new-todo', 'new todo item', {delay: 50}); 
      await page.keyboard.press("Enter"); 
      // 再添加一个 new todo item
      await page.click('#new-todo', {delay: 500}); 
      await page.type('#new-todo', 'new todo item', {delay: 50}); 
      await page.keyboard.press("Enter"); 
      todoList = await page.waitFor('#todo-list'); 
      const expectInputContent = await page.evaluate(todoList => todoList.lastChild.querySelector('label').textContent, todoList); 
      expect(expectInputContent).to.eql('new todo item');
    }) 

    // 渲染所有待办事项
    it('should render todo correct', async function() {
      todoListLength = await page.$eval('#todo-list', todoList => todoList.children.length); 
      expect(todoListLength).to.eql(2); 
    })

    // 已完成待办事项
    it('should complete todo correct', async function() {
      await page.click('#todo-list li:nth-last-child(1) input'); 
      await page.reload(); 
      let status = await page.$eval('#todo-list li:nth-last-child(1)', li => li.className); 
      expect(status).to.eql('completed');
    })

    // 删除事项
    it('should delete todo correct', async function() {
      await page.hover('#todo-list li:nth-last-child(1)');
      await page.click('#todo-list li:nth-last-child(1) button');

      await page.reload(); 
      let todoListLengthAfterDelete = await page.$eval('#todo-list', todoList => todoList.children.length); 
      expect(todoListLength - todoListLengthAfterDelete).to.eql(1); 

      await page.hover('#todo-list li:nth-last-child(1)'); 
      await page.click('#todo-list li:nth-last-child(1) button');
    }) 

  });