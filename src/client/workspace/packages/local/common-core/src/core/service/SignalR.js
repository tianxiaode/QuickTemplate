Ext.define('Common.core.service.SignalR',{
    alternateClassName: 'Signalr',
    singleton: true,

    requires:[
    ],

    autoConnect: false,
    connect: undefined,

    constructor() {
        // let me = this,
        //     token = Auth.getEncToken();
        // me.hubs = {};
        // me.qs = "enc_auth_token=" + (Ext.isEmpty(token) || token ==='null' ? "" : encodeURIComponent(token));
        // //me.qs = `deviceId=19000007&key=abc`
        // if(me.autoConnect){
        //     me.connect();
        // }
    },    

    configureConnection: function(connection) {
        let me = this;

        // Set the common hub
        me.hubs.common = connection;
        // Reconnect if hub disconnects
        connection.onclose(function (e) {
            if (e) {
                console.log('Connection closed with error: ' + e);
            }
            else {
                console.log('Disconnected');
            }

            if (!me.autoConnect) {
                return;
            }

            setTimeout(function () {
                connection.start();
            }, 5000);
        });

        // Register to get notifications
        connection.on('getNotification', function (notification) {
            Ext.fireEvent('notificationsReceived', notification);
        });
    },

    connect() {
        return;
        let me = this,
            //url = `${ROOTPATH}device`;
            url = `${AppConfig.apiUrl}signalr`;
        if (me.qs) {
            url += (url.indexOf('?') == -1 ? '?' : '&') + me.qs;
        }
        //console.log(url) ;
        // Start the connection.
        me.startConnection(url,Ext.bind(me.configureConnection,me))
            .then(function (connection) {
                console.log('Connected to SignalR server!'); //TODO: Remove log
                Ext.fireEvent('signalrConnected');
                // Call the Register method on the hub.
                connection.invoke('register').then(function () {
                    console.log('Registered to the SignalR server!'); //TODO: Remove log
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    startConnection: function(url, configureConnection) {


        return function start(transport) {
            console.log('Starting connection using ' + signalR.HttpTransportType[transport] + ' transport');
            var connection = new signalR.HubConnectionBuilder()
                .withUrl(url, transport)
                .build();
            if (configureConnection && typeof configureConnection === 'function') {
                configureConnection(connection);
            }

            return connection.start()
                .then(function () {
                    return connection;
                })
                .catch(function (error) {
                    console.log('Cannot start the connection using ' + signalR.HttpTransportType[transport] + ' transport. ' + error.message);
                    if (transport !== signalR.HttpTransportType.LongPolling) {
                        return start(transport + 1);
                    }

                    return Promise.reject(error);
                });
        }(signalR.HttpTransportType.WebSockets);
    }

});