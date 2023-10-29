Ext.define('Test.spec.common.core.util.Logger', {
    singleton: true,

    requires:[
        'Common.core.util.Logger'
    ],


    constructor(){
        describe('Common.core.util.Logger', () => {
            describe('setLevel', () =>{
                let logger = {};

                beforeEach(()=>{
                    Logger.levels.forEach(level => {
                        logger[level] = jasmine.createSpy();
                    });
                    Logger.setLogger(logger);
                })

                afterEach(()=>{
                    Logger.setLogger(console);
                })
    
    
                it("should not log when set to NONE", () => {
                    // arrange
                    Logger.setLevel('none');
        
                    // act
                    Logger.debug("test debug");
                    Logger.info("test info");
                    Logger.warn("test warn");
                    Logger.error("test error");
    
    
                    // assert
                    expect(logger.debug).not.toHaveBeenCalled();
                    expect(logger.info).not.toHaveBeenCalled();
                    expect(logger.warn).not.toHaveBeenCalled();
                    expect(logger.error).not.toHaveBeenCalled();
                });
    
                it("should not log debug, info or warn for ERROR level", () => {
                    // arrange
                    Logger.setLevel('error');
        
                    // act
                    Logger.debug("test debug");
                    Logger.info("test info");
                    Logger.warn("test warn");
                    Logger.error("test error");
        
                    // assert
                    expect(logger.debug).not.toHaveBeenCalled();
                    expect(logger.info).not.toHaveBeenCalled();
                    expect(logger.warn).not.toHaveBeenCalled();
                    expect(logger.error).toHaveBeenCalled();
                });
        
                it("should not log debug, info for WARN level", () => {
                    // arrange
                    Logger.setLevel('warn');
        
                    // act
                    Logger.debug("test debug");
                    Logger.info("test info");
                    Logger.warn("test warn");
                    Logger.error("test error");
        
                    // assert
                    expect(logger.debug).not.toHaveBeenCalled();
                    expect(logger.info).not.toHaveBeenCalled();
                    expect(logger.warn).toHaveBeenCalled();
                    expect(logger.error).toHaveBeenCalled();
                });
        
                it("should not log debug for INFO level", () => {
                    // arrange
                    Logger.setLevel('info');
        
                    // act
                    Logger.debug("test debug");
                    Logger.info("test info");
                    Logger.warn("test warn");
                    Logger.error("test error");
        
                    // assert
                    expect(logger.debug).not.toHaveBeenCalled();
                    expect(logger.info).toHaveBeenCalled();
                    expect(logger.warn).toHaveBeenCalled();
                    expect(logger.error).toHaveBeenCalled();
                });
        
                it("should log to all for DEBUG level", () => {
                    // arrange
                    Logger.setLevel('debug');
        
                    // act
                    Logger.debug("test debug");
                    Logger.info("test info");
                    Logger.warn("test warn");
                    Logger.error("test error");
        
                    // assert
                    expect(logger.debug).toHaveBeenCalled();
                    expect(logger.info).toHaveBeenCalled();
                    expect(logger.warn).toHaveBeenCalled();
                    expect(logger.error).toHaveBeenCalled();
                });
    
            })

            // describe("should log to show instance name", () => {
            //     let logger = Logger.getLogger();

            //     beforeEach(()=>{
            //         spyOn(logger, 'debug');
            //     })
    
            //     Logger.debug(this, 'test sender');
            //     //expect(logger.debug).toHaveBeenCalledWith('[DEBGU]', `[${this.$className}]`, 'test sender');
            // });
            
    
        });

    }
});