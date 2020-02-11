/**
 * 地区选择字段
 */
Ext.define('Common.Desktop.ux.field.District',{
    extend: 'Ext.field.Container',
    xtype: 'districtField',

    requires:[
        'Ext.field.ComboBox',
        'Common.Data.store.Districts'
    ],
    autoLabel: false,
    label: I18N.DistrictFieldLabel,

    viewModel:{
        stores:{
            provinces:{
                type: 'districts',
                autoLoad:true,
                proxy:{
                    type: 'format',
                    url: URI.getResource('provinces')
                }
            },
            allCities:{
                type: 'districts',
                autoLoad:true,
                proxy:{
                    type: 'format',
                    url: URI.getResource('cities')
                }
            },
            allDistricts:{
                type: 'districts',
                autoLoad:true,
                proxy:{
                    type: 'format',
                    url: URI.getResource('districts')
                }
            },
            cities:{
                type: 'chained',
                source: '{allCities}',
                filters:[
                    {property: 'code', value: '000000'}
                ]
            },
            districts:{
                type: 'chained',
                source: '{allDistricts}',
                filters:[
                    {property: 'code', value: '000000'}
                ]
            }    
        }
    },

    defaults:{
        displayField: 'text',
        valueField: 'text',
        forceSelection: true,
        autoSelect: true,
        autoLabel: false,
        queryMode: 'local',
        editable: false        
    },
    defaultType: 'combobox',
    items:[
        { 
            name: 'province', 
            flex:1, 
            bind: { store: '{provinces}'} , 
            floatedPicker: { minWidth: 200},
            placeholder: I18N.Province
        },
        { xtype: 'component', width: 5},
        { 
            name: 'city',
            flex: 1,
            bind: { store: '{cities}'} , 
            floatedPicker: { minWidth: 200},
            placeholder: I18N.City
        },
        { xtype: 'component', width: 5},
        { 
            name: 'district', 
            flex:2, 
            bind: { store: '{districts}'},
            placeholder: I18N.District
        }
    ],

    initialize(){
        let me = this;
        me.bindComboboxEvent();
    },


    bindComboboxEvent(){
        let  me = this,
            province = me.getField('province'),
            city = me.getField('city');
        province.on('select', me.onProvinceSelect ,me);
        city.on('select', me.onCitySelect ,me);
    },

    getField(fieldName){
        return this.down('combobox[name='+ fieldName+']');
    },

    getStore(fieldName){
        return this.getField(fieldName).getStore();
    },

    clearStoreFilter(fieldName){
        let store= this.getStore(fieldName);
        store.clearFilter(true);
    },

    setStoreFilter(fieldName, value){
        let store= this.getStore(fieldName);
        store.filter('code', value);
    },

    onProvinceSelect(sender , selected, eOpts ){
        let me = this;
        me.clearStoreFilter('city');
        me.setStoreFilter('city',new RegExp('^' + selected.get('code').substring(0,2)));
        me.clearStoreFilter('district');
        me.setStoreFilter('district','000000')
        
    },

    onCitySelect(sender , selected, eOpts){
        let me = this;
        me.clearStoreFilter('district');
        me.setStoreFilter('district',new RegExp('^' + selected.get('code').substring(0,4)));
    }


});