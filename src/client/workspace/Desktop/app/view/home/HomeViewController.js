Ext.define('Desktop.view.home.HomeViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.homeview',


    /**
     * 主视图显示后，显示用户名称
     */
    onHomeViewPainted(){
        this.getViewModel().set('userName', (CFG.user && CFG.user.name) || I18N.None);
    },

    /**
     * 切换子视图
     * @param {子实体的xtype}} xtype 
     */
    setCurrentView(xtype) {
        let me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', xtype) ||
                   store.findNode('viewType', xtype),
            view = (node && node.get('viewType')) ,
            existingItem = mainCard.child('component[routeId=' + view + ']'),
            parentNode = node ? node.parentNode : null,
            newView;
        // if(node && !node.get('visible')){
        //     CFG.getDialog(view).show();
        //     return;
        // }

        if(existingItem){
            mainCard.setActiveItem(existingItem);
            return;
        }

        newView = Ext.ClassManager.getByAlias('widget.' + view);
        if(!newView){
            DialogManager.show('page404');
            return;
        }


        newView = mainCard.add({
            xtype: view,
            routeId: xtype,  // for existingItem search later
            hideMode: 'offsets'
        });


        mainCard.setActiveItem(newView);


        if (parentNode && !parentNode.isRoot() && !parentNode.isExpanded()){
            parentNode.expand();
        } 
        navigationList.setSelection(node);

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
