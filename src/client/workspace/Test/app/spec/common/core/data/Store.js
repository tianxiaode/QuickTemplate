Ext.define('Test.spec.common.core.data.Store', {

    requires: [
        'Common.core.data.Store',
        'Test.store.Roles',
        'Test.store.identity.Roles',
    ],

    statics: {

        run() {
            describe('Common.core.data.Store', () => {
                let jsonTestData = Test.spec.common.core.data.Store.responseData;

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
                    let store = Ext.create('Test.store.Roles'),
                        proxy = store.getProxy(),
                        model = store.getModel(),
                        identityRoleStore = Ext.create('Test.store.identity.Roles'),
                        identityRoleModel = identityRoleStore.getModel(),
                        identityRoleProxy = identityRoleStore.getProxy();

                    it('测试模型别名为entity.role时由entiyName生成的url', () => {
                        expect(proxy.getUrl()).toEqual(`${Config.getServer()}api/roles`);
                    })

                    it('测试模型别名为 entity.identity.role 时由entiyName生成的url', () => {
                        expect(identityRoleProxy.getUrl()).toEqual(`${Config.getServer()}api/identity/roles`);
                    })

                    it('测试模型是否包含id和concurrencyStamp字段', () => {
                        expect(model.getField('id').getName()).toEqual('id');
                        expect(model.getField('concurrencyStamp').getName()).toEqual('concurrencyStamp');
                    })

                    it('测试模型是否包含translations字段', () => {
                        expect(identityRoleModel.getField('translations').getName()).toEqual('translations');
                    })

                    it('测试设置proxy参数', () => {
                        store.setExtraParams('name', 'a');
                        expect(proxy.extraParams.name).toEqual('a');
                    })

                    it('测试模型数据加载', (done) => {
                        store.load(() => {
                            expect(store.getTotalCount()).toEqual(2);
                            expect(store.getAt(0).get('name')).toEqual('admin');
                            done();
                        });
                    })

                });
            });

        },


        responseData: {
            "items": [
                {
                    "extraProperties": {
                        "additionalProp1": "string",
                        "additionalProp2": "string",
                        "additionalProp3": "string"
                    },
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "name": "admin",
                    "isDefault": true,
                    "isStatic": true,
                    "isPublic": true,
                    "concurrencyStamp": "6330d7b5d7c549deb406c96ebdd30845",
                    "permissions": [
                        "AbpIdentity.Roles", "AbpIdentity.Roles.Create"
                    ],
                    "translations": [
                        {
                            "language": "en",
                            "name": "admin"
                        },
                        {
                            "language": "zh-hans",
                            "name": "管理员"
                        }
                    ]
                },
                {
                    "extraProperties": {
                        "additionalProp1": "string",
                        "additionalProp2": "string",
                        "additionalProp3": "string"
                    },
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa5",
                    "name": "user",
                    "isDefault": false,
                    "isStatic": false,
                    "isPublic": false,
                    "concurrencyStamp": "6330d7b5d7c549deb406c96ebdd30844",
                    "permissions": [
                        "AbpIdentity.Roles", "AbpIdentity.Roles.Create"
                    ],
                    "translations": [
                        {
                            "language": "en",
                            "name": "user"
                        },
                        {
                            "language": "zh-hans",
                            "name": "用户"
                        }
                    ]
                }
            ],
            "totalCount": 2
        }
    }


});