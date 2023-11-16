Ext.define('Test.spec.common.oidc.State', {
    singleton: true,

    requires: [
        'Common.oidc.State'
    ],

    constructor() {
        describe('Common.oidc.State', () => {
            describe("constructor", () => {

                it("should generate id", () => {
                    // act
                    let subject = Ext.create('oidc.state', {
                        requetType: "type",
                    });
        
                    // assert
                    expect(subject.id).toBeDefined();
                });
        
                it("should accept id", () => {
                    // act
                    let subject = Ext.create('oidc.state',{
                        requetType: "type",
                        id: "5",
                    });
        
                    // assert
                    expect(subject.id).toEqual("5");
                });
        
                it("should accept data", () => {
                    // act
                    let subject = Ext.create('oidc.state',{
                        requetType: "type",
                        data: "test",
                    });
        
                    // assert
                    expect(subject.data).toEqual("test");
                });
        
                it("should accept data as objects", () => {
                    // act
                    let subject = Ext.create('oidc.state',{
                        requetType: "type",
                        data: { foo: "test" },
                    });
        
                    // assert
                    expect(subject.data).toEqual({ foo: "test" });
                });
        
                it("should accept create", () => {
                    // act
                    let subject = Ext.create('oidc.state',{
                        requetType: "type",
                        created: 1000,
                    });
        
                    // assert
                    expect(subject.created).toEqual(1000);
                });
        
                it("should use date.now for create", () => {
                    // arrange
                    let oldNow = Ext.now;
                    Ext.now = () => {
                        return 123 * 1000; // ms
                    };
        
                    // act
                    let subject = Ext.create('oidc.state',{
                        requetType: "type",
                    });
        
                    // assert
                    expect(subject.created).toEqual(123);
                    Ext.now = oldNow;
                });
        
                it("should accept request_type", () => {
                    // act
                    let subject = Ext.create('oidc.state',{
                        requetType: "xoxo",
                    });
        
                    // assert
                    expect(subject.requetType).toEqual("xoxo");
                });
            });
        
            it("can serialize and then deserialize", () => {
                // arrange
                let subject1 = Ext.create('oidc.state',{
                    data: { foo: "test" }, create: 1000, requetType:"type",
                });
        
                // act
                let storage = subject1.toStorageString();
                let subject2 = Common.oidc.State.fromStorageString(storage);
        
                // assert
                expect(subject2).toEqual(subject1);
            });
        
            describe("clearStaleState", () => {
        
                it("should remove old state entries", async () => {
                    // arrange
                    let oldNow = Ext.now;
                    Ext.now = () => {
                        return 200 * 1000; // ms
                    };
        
                    let prefix = Common.oidc.State.Prefix;
        
                    const s1 = Ext.create('oidc.state',{ id: "s1", created: 5, request_type:"type" });
                    const s2 = Ext.create('oidc.state',{ id: "s2", created: 99, request_type:"type" });
                    const s3 = Ext.create('oidc.state',{ id: "s3", created: 100, request_type:"type" });
                    const s4 = Ext.create('oidc.state',{ id: "s4", created: 101, request_type:"type" });
                    const s5 = Ext.create('oidc.state',{ id: "s5", created: 150, request_type:"type" });
        
                    AppStorage.set(prefix + s1.id, s1.toStorageString());
                    AppStorage.set(prefix + s2.id, s2.toStorageString());
                    AppStorage.set(prefix + s3.id, s3.toStorageString());
                    AppStorage.set(prefix + s4.id, s4.toStorageString());
                    AppStorage.set(prefix + s5.id, s5.toStorageString());
        
                    // act
                    Common.oidc.State.clearStaleState(100);
                    let keys = AppStorage.getAllKeys(prefix, true, false);

                    console.log('keys', keys);
        
                    // assert
                    expect(keys).toContain(prefix + "s4");
                    expect(keys).toContain(prefix + "s5");
                    expect(AppStorage.get(prefix + "s4")).toBeDefined();
                    expect(AppStorage.get(prefix + "s5")).toBeDefined();
                    Ext.now = oldNow;
                });

            });
            
        });


    
    }


});