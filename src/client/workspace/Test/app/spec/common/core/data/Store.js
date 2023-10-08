Ext.define('Test.spec.common.core.data.Store', {
    singleton: true,

    requires: [
        'Test.spec.common.core.data.Roles'
    ],

    constructor() {
        describe('Common.core.data.Store', () => {
            let jsonTestData = {};

            beforeEach(() => {
                jasmine.Ajax.install();

                jasmine.Ajax.stubRequest(
                    /.*roles/,
                    /.*/
                ).andReturn({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify(jsonTestData)
                });
            });

            afterEach(() => {
                jasmine.Ajax.uninstall();
            })


            describe("测试store属性和方法", () => {
                let store = Ext.create('Test.spec.common.core.data.Roles'),
                    proxy = store.getProxy(),
                    model = store.getModel(),                    
                    store2 = Ext.create('Test.spec.common.core.data.Roles2'),
                    model2 = store2.getModel(),
                    proxy2 = store2.getProxy();

                it('测试模型别名为entity.role时由entiyName生成的url', () => {
                    expect(proxy.getUrl()).toEqual(`${Config.getServer()}api/roles`);
                })

                it('测试模型别名为 entity.identity.role 时由entiyName生成的url', () => {
                    expect(proxy2.getUrl()).toEqual(`${Config.getServer()}api/identity/roles`);
                })

                it('测试模型是否包含id和concurrencyStamp字段', () => {
                    expect(model.getField('id').getName()).toEqual('id');
                    expect(model.getField('concurrencyStamp').getName()).toEqual('concurrencyStamp');
                })

                it('测试模型是否包含translations字段', () => {
                    expect(model2.getField('translations').getName()).toEqual('translations');
                })
                
            });
        });

    },

    destroy() {
        let me = this;
        me.destroyMembers('responseData');
        me.callParent();
    },

});