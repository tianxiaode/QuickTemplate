Ext.define('Desktop.view.home.HomeViewController', {
    extend: 'Common.view.home.HomeController',
    alias: 'controller.homeview',


    /**
     * 切换子视图
     * @param {子实体的xtype}} xtype 
     */
    setCurrentView(xtype) {
        let me = this,
            navigationTree = me.lookup('navigationTree');
        if(!navigationTree.isReady){
            Ext.defer(me.setCurrentView, 50 , me , [xtype]);
            return;
        }


        //如果导航菜单没有对应选项，显�?404页面
        if(!navigationTree.hasNode(xtype)) {
            me.show404Page();
            return;
        };

        let mainCard = me.lookup('mainCardPanel');

        Ext.Viewport.setActiveItem(me.getView());
        Logger.debug(me.setCurrentView, xtype)
        ViewService.show(xtype, ViewService.types.view,{}, false, mainCard);
        

    },


    /**
     * 单击导航树节点时会执行该操作
     * @param {导航树}} tree 
     * @param {选择的节点} node 
     */
    onNavigationTreeSelectionChange(tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));
        if (to) {
            this.redirectTo(to);
        }
    },

    /**
     * 切换导航栏的显示方式
     */
    onToggleNavigationSize() {
        let me = this,
            refs = me.getReferences(),
            logo= refs.logo,
            navigationTree = refs.navigationTree,
            collapsing = !navigationTree.getMicro(),
            new_width = collapsing ? 64 : 250;


        logo.el.down('span.company-name').setVisibility(!collapsing);
        logo.setWidth(new_width);
        navigationTree.setWidth(new_width);
        navigationTree.setMicro(collapsing);

    },



});
