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
        me.currentSubXtype = xtype;

        if(!navigationTree.isReady){
            Ext.defer(me.setCurrentView, 50 , me , [xtype]);
            return;
        }


        //如果导航菜单没有对应选项，显�?404页面
        if(!navigationTree.hasNode(xtype)) {
            me.redirectTo('page404');
            return;
        };

        let mainCard = me.lookup('mainCardPanel');
        let view = mainCard.down(xtype);


        if(view){
            mainCard.setActiveItem(view);
            return;
        }

        let cls = Ext.ClassManager.getByAlias('widget.' + xtype);
        if(!cls){
            me.redirectTo('page404');
            return;
        }

        view = mainCard.add({
            xtype: xtype,
            hideMode: 'display'
        });

        mainCard.setActiveItem(view);
        //me.switchNavigation(name);

    },



    switchNavigation(name){
        const me = this,
            navigationTree = me.lookup('navigationTreeList');
        
        if(!navigationTree.isReady){
            navigationTree.on('ready', me.switchNavigation, me, {single: true, args: [name]});
            return;
        }
            
        const store = navigationTree.getStore(),
            root = store.getRoot();
        let node = store.findNode('viewType', name);
            parentNode = node ? node.parentNode : null;
            
        if (parentNode && !parentNode.isRoot() && !parentNode.isExpanded()){
            parentNode.expand();
        } 

        navigationTree.suspendEvent('selectionchange');
        navigationTree.setSelection(node);    
        navigationTree.resumeEvent ('selectionchange');
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
        var me = this,
            refs = me.getReferences(),
            senchaLogo= refs.senchaLogo,
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;


        senchaLogo.setWidth(new_width);
        navigationList.setWidth(new_width);
        navigationList.setMicro(collapsing);

    },

    /**
     * 退出操作
     */
    onLogout() {
        Ext.Msg.confirm(I18N.Logout, I18N.LogoutMessage,(btn)=>{
            if(btn === 'yes'){
                HEADERS.setCookies(HEADERS.authTokenCookieName, null, null, null);
                HEADERS.setCookies(HEADERS.encrptedAuthTokenName, null, null, LOCALPATH);
                window.location.reload();        
            }
        })
    },


});
