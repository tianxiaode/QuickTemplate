Ext.define('Test.spec.common.oidc.event.StubTimer', {
    extend: 'Common.oidc.event.Timer',
    alias: 'oidc.stubtimer',

    constructor(name) {
        this.callParent(arguments);
        this.cancelWasCalled = false;
        this.duration = undefined;
        this.addHandler = jasmine.createSpy();
        this.removeHandler = jasmine.createSpy();
    },

    init(duration) {
        this.duration = duration;
    },

    cancel() {
        this.cancelWasCalled = true;
    }

   
});