Ext.define('Common.shared.ux.panel.Time',{
    extend: 'Ext.Component',
    xtype: 'uxtimepanel',

    classCls: Ext.baseCSSPrefix + 'time-panel',

    currentHour: 0,
    currentMinuteHigh: 0,
    currentMinuteLow: 0,
    currentSecondHigh: 0,
    currentSecondLow: 0,
    rowStart: `<div class="d-flex">`,
    rowEnd: `</div>`,
    elementMap:{
        hour: 'hour',
        minuteHigh: 'minute-high',
        minuteLow: 'minute-low',
        secondHigh: 'second-high',
        secondLow: 'second-low',
    },

    getTemplate() {
        return [
            {
                reference: 'hourElement',
                cls: 'm-1 border'
            },
            {
                cls: 'm-1 border d-flex p-1',
                children:[
                    {
                        reference: 'minuteHighElement',
                        cls: 'flex-grow-3 border-dashed ',
                    },
                    {
                        reference: 'minuteLowElement',
                        cls: 'flex-grow-5 border-dashed ml-1',
                    }                    
                ]
            },
            {
                cls: 'm-1 border d-flex p-1',
                children:[
                    {
                        reference: 'secondHighElement',
                        cls: 'flex-grow-3 border-dashed',
                    },
                    {
                        reference: 'secondLowElement',
                        cls: 'flex-grow-5 border-dashed ml-1',
                    }                    
                ]
            },
            {
                cls: 'd-flex',
                children:[
                    {
                        reference: 'titleElement',
                        cls: 'fw-bolder fs-5 flex-grow-1 m-1 pl-1 lh-32',
                        html: '00 : 00 : 00'
                    },
                    {
                        reference: 'okElement',
                        tag: 'button',
                        cls: 'btn btn-primary m-1'
                    },
                    {
                        reference: 'cancelElement',
                        tag: 'button',
                        cls: 'btn btn-soft-grey  m-1'
                    }
                ]                
            }
        ];

    },
    
    initialize(){
        let me = this;
        me.callParent();
        let map = me.elementMap;
        me.initTimeElement(me.hourElement, 24, 8, map.hour, true);
        me.initTimeElement(me.minuteHighElement, 6, 3, map.minuteHigh);
        me.initTimeElement(me.minuteLowElement, 10, 5, map.minuteLow);
        me.initTimeElement(me.secondHighElement, 6, 3, map.secondHigh);
        me.initTimeElement(me.secondLowElement, 10, 5, map.secondLow);
        me.okElement.setHtml(I18N.get('OK'));
        me.cancelElement.setHtml(I18N.get('Cancel'));
        me.el.on('tap', me.onElementTap, me, { delegate: '.item'});
        me.okElement.on('tap', me.onOkTap, me);
        me.cancelElement.on('tap', me.onCancelTap, me);
    },

    onElementTap(e, source, eOpts){
        let me = this,
            cls = source.className,
            el = me.getParentNode(cls);
        if(!el) return;
        me.toggleSelected(source, el);
        me.setCurrentValue(cls,  parseInt(source.getAttribute('data-value')));
        me.refreshTitle();
    },

    setValue(hour, minute, second){
        let me = this;
        me.currentHour = hour;
        me.currentMinuteHigh = Math.floor(minute/10);
        me.currentMinuteLow = minute - me.currentMinuteHigh*10;
        me.currentSecondHigh = Math.floor(second/10);
        me.currentSecondLow = second - me.currentSecondHigh*10;
        me.refreshTitle();
        me.refreshSelected();
    },

    onOkTap(){
        let me = this,
            minute = (me.currentMinuteHigh || 0 )*10 + (me.currentMinuteLow || 0 ),
            second = (me.currentSecondHigh || 0 )*10 + (me.currentSecondLow || 0 ) ;
        me.fireEvent('oktap',me, me.currentHour, minute, second );
    },

    onCancelTap(){
        let me = this;
        me.fireEvent('canceltap',me);
    },


    privates:{
        initTimeElement(el, count, cols, type, leading){
            let me = this,
                id = el.getId(),
                html = [];
            for(let i=0; i<count;i++){
                if( i > 0 && (i % cols === 0)) html.push(me.rowEnd);
                if(i % cols === 0) html.push(me.rowStart);
                let text = leading ? Format.leftPad(i, 2, '0') : i.toString();
                html.push(`<div class="flex-grow-1 text-center p-1 ${type} item " id='${id}-${i}' data-value="${i}">
                    <span>${text}</span>
                </div>`);
            }
            html.push(me.rowEnd);
            el.setHtml(html.join(''));
        },
    
        refreshTitle(){
            let me = this;
            me.titleElement.setHtml(`${Format.leftPad(me.currentHour, 2, '0')} : ${me.currentMinuteHigh}${me.currentMinuteLow} : ${me.currentSecondHigh}${me.currentSecondLow}`);
        },
    
        getParentNode(cls){
            let me = this,
                map = me.elementMap;
            if(cls.includes(map.hour)) return me.hourElement;
            if(cls.includes(map.minuteHigh)) return me.minuteHighElement;
            if(cls.includes(map.minuteLow)) return me.minuteLowElement;
            if(cls.includes(map.secondHigh)) return me.secondHighElement;
            if(cls.includes(map.secondLow)) return me.secondLowElement;
            return null;
        },
    
        getCurrentValue(cls){
            let me = this,
                map = me.elementMap;
            if(cls.includes(map.hour)) return me.currentHour;
            if(cls.includes(map.minuteHigh)) return me.currentMinuteHigh;
            if(cls.includes(map.minuteLow)) return me.currentMinuteLow;
            if(cls.includes(map.secondHigh)) return me.currentSecondHigh;
            if(cls.includes(map.secondLow)) return me.currentSecondLow;
            return 0;
        },
    
        setCurrentValue(cls, value){
            let me = this,
                map = me.elementMap;
            if(cls.includes(map.hour)) {
                me.currentHour = value;
                return;
            }
            if(cls.includes(map.minuteHigh)) {
                me.currentMinuteHigh = value;
                return;
            };
            if(cls.includes(map.minuteLow)) {
                me.currentMinuteLow = value;
                return;
            }
            if(cls.includes(map.secondHigh)) {
                me.currentSecondHigh  = value;
                return;
            }
            if(cls.includes(map.secondLow)) me.currentSecondLow  = value;
        },

        toggleSelected(current, parent){
            let me = this;
            current.className = current.className + ' ' + 'selected';
            let id = parent.getId(),
                value = me.getCurrentValue(current.className),
                itemEl = parent.down(`#${id}-${value}`, true);
            if(itemEl) me.deselectedElement(itemEl);
        },
    
        deselectedElement(el){
            el.className = el.className.replace(' selected' , '');
        },

        refreshSelected(){
            let me = this;
            me.refreshElementSelected(me.hourElement, me.currentHour);
            me.refreshElementSelected(me.minuteHighElement, me.currentMinuteHigh);
            me.refreshElementSelected(me.minuteLowElement, me.currentMinuteLow);
            me.refreshElementSelected(me.secondHighElement, me.currentSecondHigh);
            me.refreshElementSelected(me.secondLowElement, me.currentSecondLow);
        },

        refreshElementSelected( el, value){
            let me = this,
                id = me.getItemElementId(el, value)
                item = el.down(`#${id}`, true);
            if(item) item.className += ' selected';
        },

        getItemElementId(el, value){
            return `${el.getId()}-${value}`;
        }
    
    }

});