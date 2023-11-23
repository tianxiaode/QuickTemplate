Ext.define('Test.spec.common.oidc.event.Timer', {
    requires: [
        'Common.oidc.event.Timer'
    ],

    statics:{
        run(){
            describe("Common.oidc.event.Timer", () => {

                let subject;
                let now = 1;
                let formatSpy;
            
                beforeEach(() => {
                    jasmine.clock().uninstall();
                    jasmine.clock().install();
                    subject = Ext.create('oidc.event.timer', "test name");
                    formatSpy = spyOn(Common.oidc.event.Timer, "getEpochTime").and.callFake(()=>now);
                    spyOn(globalThis, "clearInterval").and.callThrough();
                    spyOn(globalThis, "setInterval").and.callThrough();
                });
            
                afterAll(()=>{
                    jasmine.clock().uninstall();
                })
            
                describe("init", () => {
            
                    it("should setup a timer", () => {
                        // act
                        subject.init(10);
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Number));
                    });
            
                    it("should use 1 second if duration is too low", () => {
                        // act
                        subject.init(0);
            
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), 1000);
            
                        // act
                        subject.init(-1);
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), 1000);
            
                        // act
                        subject.init(-5);
            
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), 1000);
                    });
            
                    it("should use duration if less than default", () => {
                        // act
                        subject.init(2);
            
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), 2000);
                    });
            
                    it("should cancel previous timer if new time is not the same", () => {
                        // act
                        subject.init(10);
            
                        // assert
                        expect(clearInterval).not.toHaveBeenCalled();
            
                        // act
                        formatSpy.and.returnValue(now+1);
                        subject.init(10);
            
                        // assert
                        expect(clearInterval).toHaveBeenCalled();
                    });
            
                    it("should not cancel previous timer if new time is same", () => {
                        // act
                        subject.init(10);
            
                        // assert
                        expect(clearInterval).not.toHaveBeenCalled();
            
                        // act
                        subject.init(10);
            
                        // assert
                        expect(clearInterval).not.toHaveBeenCalled();
                    });
                });
            
                describe("callback", () => {
            
                    it("should fire when timer expires", () => {
                        // arrange
                        let cb = jasmine.createSpy();
                        subject.addHandler(cb);
            
                        subject.init(10);
            
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
            
                        // act
                        now += 9;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(0);

                        // act
                        now += 1;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(1);
                    });
            
                    it("should fire if timer late", () => {
                        // arrange
                        let cb = jasmine.createSpy();
                        subject.addHandler(cb);
            
                        subject.init(10);
            
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
            
                        now +=9;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(0);
            
                        now +=2;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(1);
                    });
            
                    it("should cancel window timer", () => {
                        // arrange
                        subject.init(10);
            
                        // assert
                        expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
            
                        now += 10;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(clearInterval).toHaveBeenCalled();
                    });
                });
            
                describe("cancel", () => {
            
                    it("should cancel timer", () => {
                        // act
                        subject.init(10);
            
                        // assert
                        expect(clearInterval).not.toHaveBeenCalled();
            
                        // act
                        subject.cancel();
            
                        // assert
                        expect(clearInterval).toHaveBeenCalled();
                    });
            
                    it("should do nothing if no existing timer", () => {
                        // act
                        subject.cancel();
            
                        // assert
                        expect(clearInterval).not.toHaveBeenCalled();
                    });
                });
            
                describe("addHandler", () => {
            
                    it("should allow callback to be invoked", () => {
                        // arrange
                        let cb = jasmine.createSpy();
            
                        // act
                        subject.addHandler(cb);
                        subject.init(10);
                        now += 10;
                        jasmine.clock().tick(5001);
            
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
                        subject.init(10);
                        now += 10;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(4);
                    });
                });
            
                describe("removeHandler", () => {
            
                    it("should remove callback from being invoked", () => {
                        // arrange
                        let cb = jasmine.createSpy();
                        subject.addHandler(cb);
                        subject.init(10);
            
                        // act
                        subject.removeHandler(cb);
                        now += 10;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb).toHaveBeenCalledTimes(0);
                    });
            
                    it("should remove individual callback", () => {
                        // arrange
                        let cb1 = jasmine.createSpy();
                        let cb2 = jasmine.createSpy();
                        subject.addHandler(cb1);
                        subject.addHandler(cb2);
                        subject.addHandler(cb1);
            
                        // act
                        subject.init(10);
                        subject.removeHandler(cb1);
                        subject.removeHandler(cb1);
                        now += 10;
                        jasmine.clock().tick(5001);
            
                        // assert
                        expect(cb1).toHaveBeenCalledTimes(0);
                        expect(cb2).toHaveBeenCalledTimes(1);
                    });
                });
            });
            
        }
    }

});