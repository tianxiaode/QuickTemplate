Ext.define('Common.shared.mixin.Exporter',{
    mixinId: 'uxexporter',

    doExport(title,filename){
        let me = this;
            exporter = me.getExporter(title,filename),
            deferred = new Ext.Deferred();
 
        me.delayedSaveTimer = Ext.asap(me.delayedSave, me, [exporter, deferred]);
 
        return deferred.promise;        
    },

    delayedSave: function(exporter, deferred) {
        var me = this;
 
        exporter.setData(me.prepareData());
 
        exporter.saveAs().then(
            function() {
                deferred.resolve();
            },
            function(msg) {
                deferred.reject(msg);
            }
        ).always(function() {
            Ext.destroy(exporter);
        });
    },    

    extractRows: function( columns, store) {
        let me = this,
            len = store.getCount(),
            lenCols = columns.length,
            rows = [],
            i, j, record, row, cell;
 
        for (i = 0; i < len; i++) {
            record = store.getAt(i);
            row = {
                cells: []
            };
 
            for (j = 0; j < lenCols; j++) {
                cell = me.getCell(record, columns[j]);
                row.cells.push(cell || {
                    value: null
                });
            }
 
            rows.push(row);
        }

        return rows; 
    },

    prepareData(){
        let me = this,
            store = me.list.getStore(),
            entityName = me.entityName,
            table = new Ext.exporter.data.Table(),
            columns =[],
            dataColumns = [];
        me.exportFields.forEach(field => {
            if(Ext.isString(field)){
                columns.push({text: I18N.Model[entityName][field], width:150, style: null });
                dataColumns.push({dataIndex: field});
                return;
            }
            columns.push({text: field.heading || I18N.Model[entityName][field.text], width:150, style: null  });
            dataColumns.push(Object.assign({ dataIndex: field.text }, field));
        });
        table.setColumns(columns);
        table.setRows(me.extractRows(dataColumns,store));
        return table;
    },
     
    getCell: function(record, col) {
        let field = col.dataIndex,
            v = record.get(field),
            params = [v];
        if(Ext.isArray(col.fnParams)) {
            if(col.fnParams[0] === 'values'){
                params.push(record.data);
                params = params.concat(col.fnParams.slice(1));            
            }else{
                params = params.concat(col.fnParams);
            }
        }
        if(col.fn) v = FM[col.fn].apply(v, params);
        return {
            value: v
        };
    },
 
    getExporter: function(title,fileName,) {
        var cfg = {
            type: 'xlsx',
            title: title,
            fileName: fileName
        };
 
        return Ext.Factory.exporter(cfg);
    },    
   

})