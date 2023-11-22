Ext.define('Test.spec.common.oidc.event.Event', {

    requires: [
        'Common.oidc.event.Event'
    ],

    statics: {

        run() {
            describe('Common.oidc.event.Event', () => {
                let subject = Ext.create('oidc.event.event');

                describe('addHandler', () => {
                    it("should allow callback to be invoked", () => {
                        // arrange
                        let cb = jasmine.createSpy();

                        // act
                        subject.addHandler(cb);
                        subject.raise();

                        // assert
                        expect(cb).toHaveBeenCalled();
                    });

                    it("should allow multiple callbacks", () => {
                        // arrange
                        let cb = jasmine.createSpy();

                        // act
                        subject.addHandler(cb);
                        subject.addHandler(cb);
                        subject.addHandler(cb);
                        subject.addHandler(cb);
                        subject.raise();

                        // assert
                        expect(cb).toHaveBeenCalledTimes(4);
                    });

                })


                describe("removeHandler", () => {

                    it("should remove callback from being invoked", () => {
                        // arrange
                        let cb = jasmine.createSpy();

                        // act
                        subject.addHandler(cb);
                        subject.removeHandler(cb);
                        subject.raise();

                        // assert
                        expect(cb).toHaveBeenCalledTimes(0);
                    });

                    it("should remove individual callback", () => {
                        // arrange
                        let cb1 = jasmine.createSpy();
                        let cb2 = jasmine.createSpy();

                        // act
                        subject.addHandler(cb1);
                        subject.addHandler(cb2);
                        subject.addHandler(cb1);
                        subject.removeHandler(cb1);
                        subject.removeHandler(cb1);

                        subject.raise();

                        // assert
                        expect(cb1).toHaveBeenCalledTimes(0);
                        expect(cb2).toHaveBeenCalledTimes(1);
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