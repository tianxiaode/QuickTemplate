Ext.define('Test.spec.common.oidc.util.Event', {

    requires: [
        'Common.oidc.util.Event'
    ],

    statics: {

        run() {
            describe('Common.oidc.util.Event', () => {
                let subject = Ext.create('Common.oidc.util.Event');

                beforeEach(() => {
                    spyOn(Ext, 'id');
                    spyOn(Ext, 'isEmpty');
                })

                describe('addHandler', () => {
                    it("should allow callback to be invoked", () => {
                        // arrange

                        // act
                        subject.addHandler(Ext.id);
                        subject.raise();

                        // assert
                        expect(Ext.id).toHaveBeenCalled();
                    });

                    it("should allow multiple callbacks", () => {

                        // act
                        subject.addHandler(Ext.id);
                        subject.addHandler(Ext.id);
                        subject.addHandler(Ext.id);
                        subject.addHandler(Ext.id);
                        subject.raise();

                        // assert
                        expect(Ext.id).toHaveBeenCalledTimes(4);
                    });

                })


                describe("removeHandler", () => {

                    it("should remove callback from being invoked", () => {

                        // act
                        subject.addHandler(Ext.id);
                        subject.removeHandler(Ext.id);
                        subject.raise();

                        // assert
                        expect(Ext.id).toHaveBeenCalledTimes(0);
                    });

                    it("should remove individual callback", () => {
                        // arrange

                        // act
                        subject.addHandler(Ext.id);
                        subject.addHandler(Ext.isEmpty);
                        subject.addHandler(Ext.id);
                        subject.removeHandler(Ext.id);
                        subject.removeHandler(Ext.id);

                        subject.raise();

                        // assert
                        expect(Ext.id).toHaveBeenCalledTimes(0);
                        expect(Ext.isEmpty).toHaveBeenCalledTimes(1);
                    });

                });

                describe("raise", () => {

                    it("should pass params", () => {
                        // arrange
                        let a = 10;
                        let b = 11;
                        let c = 12;
                        let cb = function (arg_a, arg_b, arg_c) {
                            a = arg_a;
                            b = arg_b;
                            c = arg_c;
                        };
                        subject.addHandler(cb);

                        // act
                        subject.raise(1, 2, 3);

                        // assert
                        expect(a).toEqual(1);
                        expect(b).toEqual(2);
                        expect(c).toEqual(3);
                    });
                });

            });



        }
    }


});