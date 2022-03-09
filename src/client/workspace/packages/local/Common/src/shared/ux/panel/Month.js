Ext.define('Common.shared.ux.panel.Month', {
    extend: 'Ext.Component',
    alias: 'widget.monthpanel',

    requires: [
        'Ext.XTemplate',
    ],

    isMonthPanel: true,

    config:{
        month: null,
        year: null,
        start: null,
        end: null
    },

    baseCls: Ext.baseCSSPrefix + 'month-panel',

    getTemplate() {
        return [
            {
                cls: 'row p-3 list',
                children:[
                    {
                        reference: 'monthElement',
                        cls: 'col-6 p-1 d-flex flex-wrap',
                    },
                    {
                        reference: 'yearElement',
                        cls: 'col-6 p-1 d-flex flex-wrap',
                    }
                ]
            },
            {
                cls: 'd-flex justify-content-center',
                children:[
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
        ]
    },

    ready: false,
    initialize(){
        let me = this;
        me.initMonth();
        me.initYear();
        me.initButton();
        me.callParent();
        me.ready = true;
    },

    onLocalized(){
        let me = this;
        me.callParent();
        me.onLocalizedMonth();
        me.onLocalizedButton();
    },

    initMonth(){
        let me = this,
            now = new Date(),
            current = me.getMonth() || (now.getMonth()+1),
            el = me.monthElement,
            monthNames = Ext.Date.monthNames,
            index = 1,
            html = [];
        monthNames.forEach(m=>{
            let selected = current === index ? 'selected' : '';
            html.push(`<div class="p-2 w-50 text-center month list-item ${selected} " data-val="${index}">${m}</div>`);
            index++;
        });
        el.setHtml(html.join(''));
        el.on('tap', me.onMonthTap, me);
        me.currentMonth = current;
        me.currentLanguage = I18N.getCurrentLanguage();
    },

    onLocalizedMonth(){
        let me= this,
            language = I18N.getCurrentLanguage();
        if(language === me.currentLanguage) return;
        let el = me.monthElement,
            monthNames = Ext.Date.monthNames,
            index =1;
        monthNames.forEach(m=>{
            let sub = el.child(`div:nth-child(${index})`);
            if(sub) sub.setHtml(m);
            index++;
        });
        me.currentLanguage = language;

    },

    onLocalizedButton(){
        let me= this;
        me.okElement.setHtml(I18N.get('OK'));
        me.cancelElement.setHtml(I18N.get('Cancel'));

    },

    initYear(){
        let me = this,
            el = me.yearElement,
            html = [
                `<div class="p-2 w-50 text-center year list-item text-muted disabled"  data-key="prev"><span class="x-fa fa-angle-double-left"></span></div>`,
                `<div class="p-2 w-50 text-center year list-item text-muted disabled " data-key="next"><span class="x-fa fa-angle-double-right"></span></div>`
            ];
        for (let i = 0; i < 10; i++) {
            html.push(`<div class="p-2 w-50 text-center year list-item disabled"  data-key="y${i+1}">&nbsp;</div>`);
        }
        el.setHtml(html.join(''));
        el.on('tap', me.onYearTap, me);
        let prevEl = el.child('[data-key=prev]'),
            nextEl = el.child('[data-key=next]');
        me.prevEl = prevEl;
        me.nextEl = nextEl;
        prevEl.on('tap', me.onPagingMove, me, -1);
        nextEl.on('tap', me.onPagingMove, me, 1);
        
    },


    /**
     * 禁用/启用元素
     * @param {元素} le 
     * @param {是否禁用} disabled 
     */
    setElementDisabled(el,disabled){
        if(disabled) {
            el.addCls('disabled');
            return;
        }
        el.removeCls('disabled');
    },

    setElementSelected(el, selected){
        if(selected) {
            el.addCls('selected');
            return;
        }
        el.removeCls('selected');
    },

    onPagingMove(sender,target, dir){
        if(target.tagName === 'SPAN') target = target.parentNode;
        if(target.classList.value.includes('disabled')) return;
        let me = this;
        me.currentPage = me.currentPage + dir;
        me.updateYearList();
    },

    updateYearList(){
        let me = this,
            el = me.yearElement,
            current = me.currentYear,
            start = me.getStart(),
            end = me.getEnd(),
            total = end-start+1,
            pageCount = Math.ceil(total / 10),
            currentPage = me.currentPage;
            fromRecord = start + ((currentPage - 1) * 10),
            toRecord = Math.min(fromRecord+ 10, end);
        for(let i = 0;i < 10; i++){
            let yearEl = el.child(`[data-key=y${i+1}]`),
                year = fromRecord + i;
            if(!yearEl) continue;
            me.setElementDisabled(yearEl, year > toRecord );
            if(year<= toRecord ){
                yearEl.setHtml(year);
                yearEl.set({ 'data-val': year });
            }else{
                yearEl.setHtml('&nbsp;');
                yearEl.set({ 'data-val': undefined });
            }
            me.setElementSelected(yearEl, year === current );
        }
        me.setElementDisabled(me.prevEl, currentPage === 1);
        me.setElementDisabled(me.nextEl, currentPage === pageCount);

    },

    onMonthTap(e, target){
        if(!target.classList.value.includes('list-item')) return;
        let month = target.getAttribute('data-val');
        if(!month) return;
        let me = this,
            old = me.monthElement.child('.selected');
        if(old) me.setElementSelected(old, false);
        me.setElementSelected(Ext.fly(target), true);
        me.currentMonth =parseInt(month);
    },

    onYearTap(e, target){
        if(!target.classList.value.includes('list-item')) return;
        let year = target.getAttribute('data-val');
        if(!year) return;
        let me = this,
            old = me.yearElement.child('.selected');
        if(old) me.setElementSelected(old, false);
        me.setElementSelected(Ext.fly(target), true);
        me.currentYear = parseInt(year);
    },

    initButton(){
        let me= this,
            ok = me.okElement,
            cancel = me.cancelElement;
        ok.setHtml(I18N.get('OK'));
        cancel.setHtml(I18N.get('Cancel'));
        ok.on('tap', me.onOkTap, me);
        cancel.on('tap', me.onCancelTap, me);
    },

    onOkTap(){
        let me = this;
        me.fireEvent('oktap',me, me.currentYear, me.currentMonth );
    },

    onCancelTap(){
        let me = this;
        me.fireEvent('canceltap',me);
    },

    applyStart(value){
        if(!value){
            let now = new Date();
            value = now.getFullYear() - 10;
        }
        return value;
    },

    applyEnd(value){
        if(!value){
            let now = new Date();
            value = now.getFullYear() + 10;
        }
        return value;
    },

    updateStart(value){
        if(this.ready) this.updateYearList();
    },

    updateEnd(value){
        if(this.ready) this.updateYearList();
    },

    applyMonth(value){
        if(!value){
            let now = new Date();
            value = now.getMonth();
        }
        return value;
    },

    updateMonth(value){
        if(!value)return;
        if(value<1 || value>12) return;
        let me = this,
            el = me.monthElement,
            old = el.child('.selected')
            child = el.child(`div:nth-child(${value})`);
        if(!child){
            Ext.defer(me.updateMonth, 50,  me, [value]);
            return;
        }
        if(old) me.setElementSelected(old, false);
        me.setElementSelected(child, true);
        me.currentMonth = value;
    },

    applyYear(value){
        if(!value){
            let now = new Date();
            value = now.getFullYear();
        }
        return value;
    },

    updateYear(value){
        let me = this;
        if(!me.ready) return;
        let end = me.getEnd();
        if(value>end) value = end;
        //根据当前年计算当前页
        let start = me.getStart(),
            currentPage = Math.floor((value-start)/10)+1;
        me.currentYear = value;
        me.currentPage = currentPage;
        me.updateYearList();
    }

});
