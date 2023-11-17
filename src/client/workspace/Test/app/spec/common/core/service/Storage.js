Ext.define('Test.spec.common.core.service.Storage', {

    requires: [
        'Common.core.service.Storage'
    ],

    statics: {

        run() {
            describe('Common.core.service.Storage', () => {
                let store = window.localStorage,
                    cookies = Ext.util.Cookies;
                store.setItem('a1', 'a1');
                store.setItem('a2', 'a2');
                store.setItem('a3', 'a3');
                store.setItem('aa1', 'aa1');
                store.setItem('aa2', 'aa2');
                store.setItem('b1', 'b1');
                store.setItem('A1', 'A1');
                cookies.set('a1', 'a1');
                cookies.set('a2', 'a2');
                cookies.set('a3', 'a3');
                cookies.set('aa1', 'aa1');
                cookies.set('aa2', 'aa2');
                cookies.set('b1', 'b1');
                cookies.set('A1', 'A1');


                describe("验证localStorage", () => {
                    it('验证存取值', () => {
                        AppStorage.set('c1', 'c1');
                        let value = AppStorage.get('c1');
                        expect(value).toEqual('c1');
                        expect(AppStorage.get('a1')).toEqual('a1');
                    });

                    it('验证删除值', () => {
                        AppStorage.remove('c1');
                        expect(AppStorage.get('c1')).toEqual(null);
                    });

                    it('验证获取key', () => {
                        let keys = AppStorage.getAllKeys();
                        expect(keys).toContain('a1');
                        expect(keys).toContain('a2');
                        expect(keys).toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).toContain('aa2');
                        expect(keys).toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a1');
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).not.toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a', true, false);
                        expect(keys).toContain('a1');
                        expect(keys).toContain('a2');
                        expect(keys).toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('1', false, true);
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a1', false, false);
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a1', false, false, false);
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).not.toContain('A1');
                    });

                });

                describe("验证Cookies", () => {
                    AppStorage.isLocalStorage = false;
                    it('验证存取值', () => {
                        AppStorage.set('c1', 'c1');
                        let value = AppStorage.get('c1');
                        expect(value).toEqual('c1');
                        expect(AppStorage.get('a1')).toEqual('a1');
                    });

                    it('验证删除值', () => {
                        AppStorage.remove('c1');
                        expect(AppStorage.get('c1')).toEqual(null);
                    });

                    it('验证获取key', () => {
                        let keys = AppStorage.getAllKeys();
                        expect(keys).toContain('a1');
                        expect(keys).toContain('a2');
                        expect(keys).toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).toContain('aa2');
                        expect(keys).toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a1');
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).not.toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a', true, false);
                        expect(keys).toContain('a1');
                        expect(keys).toContain('a2');
                        expect(keys).toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('1', false, true);
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a1', false, false);
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).toContain('A1');

                        keys = AppStorage.getAllKeys('a1', false, false, false);
                        expect(keys).toContain('a1');
                        expect(keys).not.toContain('a2');
                        expect(keys).not.toContain('a3');
                        expect(keys).toContain('aa1');
                        expect(keys).not.toContain('aa2');
                        expect(keys).not.toContain('b1');
                        expect(keys).not.toContain('A1');
                    });
                    AppStorage.isLocalStorage = true;
                });
            });

        }
    }


})
