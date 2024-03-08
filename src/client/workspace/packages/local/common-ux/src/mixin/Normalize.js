Ext.define('Common.mixin.Normalize', {
    extend: 'Ext.Mixin',

    /**
     * 转换字符串首个字母为大写
     * @param {要转换的字符串} str 
     * @returns 
     */
    capitalize(str){
        return Ext.String.capitalize(str);
    },

    /**
     * 将单词转换为复数
     * @param {单词} word 
     * @returns 
     */
    getPluralizeEntityName(word){
        return Ext.util.Inflector.pluralize(this.getEntityName());
    },

    /**
     * 根据实体名称获取表单类型名称
     * @returns 
     */

    getFormType(){
        return `${this.getEntityName()}form`.toLowerCase();
    },

    /**
     * 根据资源名和实体名获取模型名称
     * @returns 
     */
    getModelName(){
        return `entity.${this.getResourceName()}.${this.getEntityName()}`;
    },

    getErrorMessage(error){
        let me = this,
            entityName = me.getEntityName(),
            resourceName = me.getResourceName();
            message = [ `<p class="m-1 text-bold" >${error.message}</p>`];
        if(!error.validationErrors) return message.join('');
        message.push(`<ul class="message-tips">`);
        Ext.Object.each(error.validationErrors, (key, value)=>{
            let locName = I18N.get(key, resourceName, entityName); 
            message.push(`<li class="danger my-1 mx-2">`);
            message.push(`<span class=" text-bold">`);
            message.push(locName);
            message.push(`${I18N.getLabelSeparator()}`);
            message.push(`</span>`);
            message.push(`<p class="my-1 mx-3">`);
            Ext.each(value, v=>{
                message.push(`${v.replace(me.capitalize(key), locName)}<br>`);
            })

            message.push(`</p>`);
            message.push(`</li>`);
        })
        message.push('</ul>');
        return message.join('');
    }


});
