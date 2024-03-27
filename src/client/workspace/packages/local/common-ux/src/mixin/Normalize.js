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
            labelSeparator = I18N.getLabelSeparator(),
            messages = [ ];
        if(!error.validationErrors) return Template.getMessage(error.message, messages, 'danger');
        Ext.Object.each(error.validationErrors, (key, value)=>{
            let localizedName = I18N.get(key, resourceName, entityName); 
            messages.push(`
                <span class=" text-bold">
                    ${localizedName}${labelSeparator}
                </span>
                <p class="my-1 mx-3">
                    ${value.map(v=>v.replace(me.capitalize(key), localizedName)).join('<br>')}
                </p>
            `)
        })
        return Template.getMessage(error.message, messages, 'danger');
    }


});
