Ext.define('Common.shared.ux.panel.NumberInput',{
    extend: 'Ext.Widget',
    xtype: 'uxnumberinputpanel',

    isNumberInput: true,
    classCls: Ext.baseCSSPrefix + 'number-input-panel',


    baseBitCls: [ 'hundred', 'decade', 'unit', 'decimal-first', 'decimal-second'],
    itemEls: new Array(5).fill(null),
    height: 260,
    zIndex: 200,

    config:{
        value: 0,
        decimals: 2,
    },

    getTemplate() {
        let me = this,
            subTpl = [],
            subHtml = '',
            tpl = [];
        for(let i = 0; i<10; i++){
            subTpl.push(`<div class="{0} item " data-bit="{1}">${i}</div>`);
        }
        subHtml = subTpl.join('');
        for(let i = 0; i<5; i++){
            let cls =  me.baseBitCls[i],
                containerCls = cls+'-container';            
            tpl.push(`<div class="item-container flex-grow-1 ${containerCls}">`);
            tpl.push(Format.format(subHtml, cls ,i));
            tpl.push(`</div>`);
        }
    
        return [
            {
                reference: 'titleElement',
                cls: 'text-center fw-bolder fs-5 flex-grow-1 p-2'
            },
            {
                reference: 'bodyElement',
                cls: 'd-flex flex-wrap',
                html: tpl.join(''),
                listeners:{
                    tap:{
                        delegate: '.item',
                        fn: me.onElementTap,
                        scope: me
                    }
                }
            }
        ];
    },

    applyDecimals(decimals){
        if(decimals > 2) return 2;
        return decimals;
    },

    updateDecimals(decimals){
        let me = this,
            columns = 5 - decimals;
        if(!me.bodyElement){
            Ext.defer(me.updateDecimals, 50 ,me, [decimals]);
            return;
        }
        me.bodyElement.removeCls('no-decimals');
        me.bodyElement.removeCls('decimals-one');
        if(decimals === 0) {
            me.bodyElement.addCls('no-decimals')
        };
        if(decimals === 1) {
            me.bodyElement.addCls('decimals-one');
        };
        //me.initContainerWidth();
        return decimals;        
    },

    updateValue(value){
        this.initValueDisplay(value);
        return value;
    },

    initContainerWidth(){
        let containers = me.bodyElement.query('.item-container'),
            width = `calc( 100% / ${columns} - 2px )`;
        containers.forEach(c=>{
            c.style.width = width;
        })
        console.log(containers);
    },

    onElementTap(e, source, eOpts){
        let me = this,
            index = source.getAttribute('data-bit'),
            input = source.innerHTML,
            format = me.getDataFormat(),
            ln = format.length +2,
            old = me.getValue(),
            oldStr = Format.leftPad(Format.number(old, format), ln, '0' ),
            split = oldStr.split('');
        if(oldStr.includes('.') && index>2) index++;
        split[index] = input;
        let str = split.join(''),
            value = str.includes('.') ? parseFloat(str) : parseInt(str);
        me.setValue(value);
        me.fireEvent('change', me, value, old);
    },

  
    privates:{
        initValueDisplay(value){
            let me = this,
                format = me.getDataFormat(),
                ln = format.length + 2,
                str = Format.leftPad(Format.number(value, format), ln, '0' );
            me.titleElement.setHtml(str);
            for(let i=0; i<ln; i++){
                let v = str[i],
                    index = i;
                if(v === '.') continue;
                if(index > 3) index--;
                me.initElementDisplay(index, v);
            }
        },

        initElementDisplay(index, value){
            let me = this,
                els = me.itemEls[index];
            if(!els){
                els = me.itemEls[index] = me.bodyElement.query(`.${me.baseBitCls[index]}`);
            }
            els.forEach(item=>{
                let cls = item.classList.value;
                if(cls.includes('selected')) item.className = item.className.replace(' selected', '');
                if(item.innerHTML === value) item.className += ' selected';
            });    
        },

        getDataFormat(){
            let me = this,
                decimals = me.getDecimals();
            if(decimals === 0) return '0';
            if(decimals === 1) return '0.0';
            return '0.00';
        }
    }

})