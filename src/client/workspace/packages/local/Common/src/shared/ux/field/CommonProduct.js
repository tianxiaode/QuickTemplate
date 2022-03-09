Ext.define('Common.shared.ux.field.CommonProduct',{
    extend: 'Common.shared.ux.field.ComboBox',
    xtype: 'commonproductfield',

    requires:[
        //'Common.data.store.productmanagement.CommonProducts',
    ],

    store:{
        type: 'commonproducts',
        autoLoad: true,
        proxy:{
            type:'format',
            url: URI.crud('CommonProduct', 'localizations')
        },
        sorters: 'name'
    },

    displayField: 'name',
    valueField: 'name',
    forceSelection: false,
    matchFieldWidth: false,
    autoSelect: false,
    // autoFocusLast:false,
    // autoFocus: false,
    itemTpl: 'commonProduct'
    // `
    //     <div class="row" style="width:300px;">
    //         <div class="col-auto p-1">
    //             <span  id="{image:this.image}" class="d-inline-block image" style="width:45px;height:60px"></span>
    //         </div>
    //         <div class="col">
    //             <p class="p-0 m-0 lh-20 font-weight-bolder text-truncate">{name:this.listHighlight}</p>
    //             <p class="p-0 m-0 lh-20 text-truncate">{barcode:this.listHighlight}</p>
    //             <p class="p-0 m-0 lh-20 text-truncate">{brand:unDefine}/{specification:unDefine}/{unit:unDefine}</p>
    //         </div>
    //     </div>
    // `,


    
})