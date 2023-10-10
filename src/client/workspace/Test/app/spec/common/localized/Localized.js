Ext.define('Test.spec.common.localized.Localized', {
    singleton: true,

    constructor() {
        describe('Common.core.localized.Localized', () => {
            let jsonTestData = this.responseData;

            beforeEach(() => {
                jasmine.Ajax.install();

                jasmine.Ajax.stubRequest(
                    /.*localization/,
                    /.*/
                ).andReturn({
                    status: 200,
                    contentType: 'application/json',
                    responseText: JSON.stringify(jsonTestData),
                    
                });
            });

            afterEach(() => {
                jasmine.Ajax.uninstall();
            })


            describe("验证获取本地化资源", () => {
                it('验证返回数据', (done) => {
                    I18N.loadResources().then((response) => {
                        expect(I18N.getDefaultResourceName()).toEqual('QuickTemplate');
                        expect(I18N.getCurrentLanguage()).toEqual('zh-Hans');
                        expect(I18N.get('Cancel')).toEqual('取消');
                    }).catch((err) => {
                        expect(err).toBeFalsy();
                    }).then(done)

                })
            });

        });

    },

    destroy() {
        let me = this;
        me.destroyMembers('responseData');
        me.callParent();
    },


    responseData: {
        "values": {
            "ExtResource": {
                "WelcomeLogin": "欢迎登录",
                "Username/Email/Phone": "用户名/邮箱/手机",
                "Password": "密码",
                "Remember Me": "记住我",
                "ForgotPassword": "<a href='#ForgotPassword' class='link-forgot-password'>忘记密码</a>",
                "Login": "登录",
                "DefaultMessageTitle": "信息",
                "Sunday": "日",
                "Monday": "一",
                "Tuesday": "二",
                "Wednesday": "三",
                "Thursday": "四",
                "Friday": "五",
                "Saturday": "六",
                "January": "一月",
                "February": "二月",
                "March": "三月",
                "April": "四月",
                "May": "五月",
                "June": "六月",
                "July": "七月",
                "August": "八月",
                "September": "九月",
                "October": "十月",
                "November": "十一月",
                "December": "十二月",
                "AM": "上午",
                "PM": "下午",
                "NextText": "下月 (Ctrl+→)",
                "PrevText": "上月 (Ctrl+←)",
                "Sort Ascending": "正序",
                "Sort Descending": "倒序",
                "Filter": "过滤器",
                "Is not a valid email address": "不是有效的电子邮件地址",
                "Must be present": "值必须存在",
                "Value must be greater than {0}": "值必须至少为{0}",
                "Value must be less than {0}": "值必须不超过{0}",
                "Value must be between {0} and {1}": "值必须在 {0} 和 {1} 之间",
                "Is not a valid CIDR block": "不是有效的CIDR块",
                "Is not a valid currency amount": "不是有效的货币金额",
                "Is not a valid date": "不是有效日期",
                "Is not a valid date and time": "不是有效的日期和时间",
                "Is a value that has been excluded": "是已排除的值",
                "Is in the wrong format": "格式错误",
                "Is not in the list of acceptable values": "值不在接受列表中",
                "Is not a valid IP address": "不是有效的IP地址",
                "Length must be at least {0}": "长度必须至少为{0}",
                "Length must be no more than {0}": "长度不得超过{0}",
                "Length must be between {0} and {1}": "长度必须介于{0}和{1}之间",
                "Is not a valid number": "不是有效的数字",
                "Is not a valid phone number": "不是有效的电话号码",
                "Must be numeric": "必须是数字",
                "Must be at least {0}": "必须至少为{0}",
                "Must be no more than than {0}": "必须不超过{0}",
                "Must be between {0} and {1}": "必须在 {0} 和 {1} 之间",
                "Is not a valid time": "不是有效时间",
                "Is not a valid URL": "不是有效的URL",
                "DragText": "选择了 {0} 行",
                "LoadMoreText": "加载更多...",
                "NoMoreRecordsText": "没有更多记录",
                "LoadingText": "加载中...",
                "LoadedText": "已加载",
                "PullText": "下拉刷新...",
                "ReleaseText": "释放刷新...",
                "LastUpdatedText": "上次更新: ",
                "EmptyText": "没有要显示的数据",
                "MinDateMessage": "此字段中的日期必须在 {0} 之后",
                "MaxDateMessage": "此字段中的日期必须为 {0}",
                "This field is required": "此字段是必填字段",
                "Browse...": "浏览中...",
                "MinValueText": "该输入项的最小值是 {0}",
                "MaxValueText": "该输入项的最大值是 {0}",
                "DecimalsText": "最大十进制数 (0)",
                "Value is not a valid number": "{0} 不是有效数值",
                "Locked (Left)": "锁定（左)",
                "Unlocked": "解锁",
                "Locked (Right)": "锁定（右）",
                "Locked": "区域",
                "Columns": "列",
                "Group by this field": "以此分组",
                "Show in groups": "分组显示",
                "CollapseToolText": "折叠面板",
                "ExpandToolText": "展开面板",
                "OK": "确定",
                "Abort": "中止",
                "Retry": "重试",
                "Ignore": "忽略",
                "Yes": "是",
                "No": "否",
                "Cancel": "取消",
                "Apply": "应用",
                "Save": "保存",
                "Submit": "提交",
                "Help": "帮助",
                "Close": "关闭",
                "Maximize to fullscreen": "最大化到全屏",
                "Restore to original size": "恢复到原始大小",
                "Today": "今天",
                "UnknownError": "未知错误",
                "LabelSeparator": "：",
                "DefaultDateFormat": "Y-m-d",
                "DefaultDateTimeFormat": "Y-m-d H:i:s",
                "CurrencySign": "￥",
                "Signing": "正在登录...",
                "LoginSuccess": "登录成功",
                "LoadingOrganizationUnit": "正在加载组织...",
                "NoOrganizationUnit": "你没有所属组织，无法访问本系统！",
                "SelectOrganizationUnit": "选择组织",
                "Logout": "退出",
                "LogoutMessage": "确定退出系统？",
                "Setting": "设置",
                "Alarm": "通知",
                "BackLog": "代办事项",
                "Year": "年",
                "Month": "月",
                "Day": "日",
                "DayText": "日",
                "Hour": "小时",
                "Minute": "分钟",
                "Second": "秒",
                "Milliseconds": "微秒",
                "FirstPage": "第一页",
                "PrevPage": "上一页",
                "NextPage": "下一页",
                "BeforePageText": "第",
                "AfterPageText": "页,共 {0} 页",
                "LastPage": "最后页",
                "Refresh": "刷新",
                "EmptyMessage": "没有数据",
                "CountMessage": "共 {0} 条",
                "DeleteNoSelection": "请选择要删除的{0}",
                "DeleteWaitMsg": "正在删除，请等待……",
                "DeleteConfirmMessageTitle": "删除",
                "DeleteConfirmMessage": "<p>确定要删除以下数据？</p>{0}",
                "DeleteAllConfirmMessage": "<p>确认要删除所选的全部数据？</p><p style=\"color:red;\">注意：部分数据可能因条件限制删除不了！</p>",
                "DeleteSuccess": "数据已删除",
                "Add": "新建",
                "Edit": "编辑",
                "Delete": "删除",
                "Search": "查询",
                "CancelSearch": "取消查询",
                "Copy": "复制",
                "NoPermission": "没有权限执行操作",
                "NoSelection": "请先选择数据，再执行操作",
                "SelectItem": "请选择一个条目",
                "SaveAndNewButtonText": "保存和新建",
                "HasChild": "节点下还有子节点，不允许删除",
                "RefreshToke": "正在进入组织 {0} ...",
                "Page404Text": "<p class='error-text'>页面不存在，尝试返回<a href='.'>首页</a></p>",
                "RequiredMessage": "此字段是必填字段",
                "ValidationMessage": "格式错误",
                "Value does not match the required format": "值与所需格式不匹配",
                "Export": "导出",
                "Import": "导入",
                "ExportQrCode": "导出二维码",
                "UpdateSuccess": "数据已更新",
                "SaveSuccess": "数据已保存",
                "SaveAndNew": "保存并新建",
                "SavedAndNew": "数据已保存，可以继续新建记录",
                "SavedAndExit": "数据已保存，窗口即将关闭",
                "SwitchOrganizationUnit": "切换组织",
                "Saving": "正在保存...",
                "Errors": "错误信息",
                "DisplayName": "显示名",
                "Language": "语言",
                "SelectAll": "全部选择",
                "DeselectAll": "取消全选",
                "IsMicroMessenger": "<p>请点击微信窗口右上角的<span class='fi md-icon-more blue-a400'></span>按钮并点击<span class='blue-a400'>在浏览器打开</span>在别的浏览器打开应用，再进行导出！</p>",
                "RowNumber": "行号",
                "SingleSelect": "单选",
                "MultiSelect": "多选",
                "All": "全部",
                "OnlyEmptyValues": "仅空值",
                "None": "无",
                "Null": "Empty",
                "True": "是",
                "False": "否",
                "EmptyAllMessage": "清空所有消息",
                "AllAsRead": "全部标记为已读",
                "DownLoad": "下载",
                "IsRead": "已读",
                "DateRange": "单次查询日期的最长跨度为 {0} 天",
                "Browse": "浏览",
                "InvalidFile": "不是有效文件",
                "MaxFileSize": "只允许上传大小为 '{0}'的文件",
                "ExceedsAllowedSize": "文件 {0} 超出了允许的大小({1})",
                "AllowedFileType": "只允许上传类型为 '{0}' 的文件",
                "NotInAllowedFileType": "文件 {0} 不在允许的文件类型({1})中",
                "Uploading": "{0} 已上传",
                "UploadComplete": "<span class='text-success'>已上传</span>",
                "UploadError": "<span class='text-danger'>上传失败: {0}</span>",
                "TapToCancel": "单击图标可取消",
                "TapToAbort": "单击图标可中止",
                "Undefined": "未定义",
                "History": "历史记录",
                "NoFilesToUpload": "没有要上传的文件",
                "ImportSuccess": "导入成功",
                "Value": "值",
                "Permissions": "权限",
                "Permission:Create": "创建",
                "Permission:Edit": "编辑",
                "Permission:Update": "编辑",
                "Permission:Delete": "删除",
                "Permission:Access": "访问",
                "Country": "国家",
                "Province": "省份",
                "City": "城市",
                "District": "地区",
                "NotBeDeleted": "{0} '{1}' 不能删除",
                "Select": "选择",
                "Filename": "文件",
                "FileSize": "文件大小",
                "ComputeHash": "正在计算文件 {0} 散列值",
                "CheckFile": "正在校验文件 {0}",
                "CheckFileSuccess": "已完成文件 {0} 的校验，已上传 {1} 分片,未上传 {2} 分片",
                "CheckFileError": "<span class='text-danger'>校验文件 {0} 时发生错误： {1}</span>",
                "FileStart": "开始上传文件 {0}",
                "FileReady": "文件 {0} 可以开始上传",
                "ChunkUploaded": "已完成文件 {0} 的分片 {1} 上传",
                "ChunkError": "文件A的分片2上传发生错误: {2}",
                "FileSuccess": "文件 {0} 已上传",
                "FileFailure": "文件 {0} 上传失败: {1}",
                "More": "更多信息",
                "Multilingual": "多语言",
                "Exists": "{0} 已存在",
                "StartDateGreater": "开始时间不能大于结束时间",
                "EndDateLess": "结束时间不能小于开始时间",
                "NoSelected": "未选择任何 {0}",
                "Selected": "已选择 {0}",
                "NullValueAndEditMessage": "单击这里进行编辑",
                "EditRole": "编辑角色",
                "EditUser": "编辑用户",
                "NewPassword": "新密码",
                "ConfirmPassword": "密码确认",
                "PasswordNoEqual": "两次输入的密码不同",
                "Lockable": "可锁定",
                "UserLocked": "已锁定",
                "PasswordRequireDigit": "密码必须包含数字",
                "PasswordRequireLowercase": "密码必须包含小写字符",
                "PasswordRequireUppercase": "密码必须包含大写字符",
                "PasswordRequireNonAlphanumeric": "密码必须包含特殊字符",
                "PasswordRequireLength": "密码必须包含 {0} 个字符",
                "Role": "角色",
                "User": "用户",
                "CurrentUser": "当前用户",
                "DisplayName:Selected": "已选",
                "DisplayName:NotSelected": "未选",
                "DisplayName:To": "收件人",
                "DisplayName:Subject": "主题",
                "DisplayName:Body": "内容",
                "DisplayName:SendTest": "发送测试邮件",
                "TheMessageWasSent": "邮件已发送",
                "Granted": "已授予",
                "LockoutEnd": "结束锁定时间",
                "CreatorId": "创建者Id",
                "CreationTime": "创建时间",
                "LastModifierId": "最后更新者Id",
                "lastModificationTime": "Last modification time",
                "Reset": "重置",
                "FileSizeNotAvailable": "文件大小不符合要求",
                "LastModificationTime": "最后更新时间"
            },
            "Permissions": {
                "AbpIdentity": "身份标识管理",
                "AbpIdentity.Roles": "角色管理",
                "AbpIdentity.Roles.Create": "创建",
                "AbpIdentity.Roles.Update": "编辑",
                "AbpIdentity.Roles.Delete": "删除",
                "AbpIdentity.Roles.ManagePermissions": "更改权限",
                "AbpIdentity.Users": "用户管理",
                "AbpIdentity.Users.Create": "创建",
                "AbpIdentity.Users.Update": "编辑",
                "AbpIdentity.Users.Delete": "删除",
                "AbpIdentity.Users.ManagePermissions": "更改权限",
                "AbpIdentity.UserLookup": "用户查询",
                "SettingManagement": "设置管理",
                "SettingManagement.Emailing": "邮件",
                "SettingManagement.Emailing.Test": "邮件测试",
                "SettingManagement.PasswordPolicy": "密码策略",
                "SettingManagement.LookupPolicy": "用户锁定策略",
                "OpenIddict": "OpenIddict",
                "OpenIddict.Applications": "应用程序",
                "OpenIddict.Applications.Create": "创建",
                "OpenIddict.Applications.Update": "编辑",
                "OpenIddict.Applications.Delete": "删除",
                "OpenIddict.Applications.ManagePermissions": "管理权限",
                "OpenIddict.Scopes": "范围",
                "OpenIddict.Scopes.Create": "创建",
                "OpenIddict.Scopes.Update": "编辑",
                "OpenIddict.Scopes.Delete": "删除",
                "OpenIddict.Scopes.ManagePermissions": "管理权限",
                "Infrastructures": "Permission:Infrastructures",
                "Infrastructures.Districts": "地区管理",
                "Infrastructures.Districts.Create": "创建",
                "Infrastructures.Districts.Update": "编辑",
                "Infrastructures.Districts.Delete": "删除",
                "Infrastructures.Districts.ManagePermissions": "更改权限",
                "QuickTemplate": "QuickTemplate",
                "FeatureManagement": "功能管理",
                "FeatureManagement.ManageHostFeatures": "管理Host功能"
            }
        },
        "resources": {},
        "languages": [
            {
                "cultureName": "en",
                "uiCultureName": "en",
                "displayName": "English",
                "flagIcon": "gb"
            },
            {
                "cultureName": "zh-Hans",
                "uiCultureName": "zh-Hans",
                "displayName": "简体中文",
                "flagIcon": null
            },
            {
                "cultureName": "zh-Hant",
                "uiCultureName": "zh-Hant",
                "displayName": "繁體中文",
                "flagIcon": null
            }
        ],
        "currentCulture": {
            "displayName": "中文（简体）",
            "englishName": "Chinese (Simplified)",
            "threeLetterIsoLanguageName": "zho",
            "twoLetterIsoLanguageName": "zh",
            "isRightToLeft": false,
            "cultureName": "zh-Hans",
            "name": "zh-Hans",
            "nativeName": "中文（简体）",
            "dateTimeFormat": {
                "calendarAlgorithmType": "SolarCalendar",
                "dateTimeFormatLong": "yyyy年M月d日dddd",
                "shortDatePattern": "yyyy/M/d",
                "fullDateTimePattern": "yyyy年M月d日dddd tth:mm:ss",
                "dateSeparator": "/",
                "shortTimePattern": "tth:mm",
                "longTimePattern": "tth:mm:ss"
            }
        },
        "defaultResourceName": "QuickTemplate",
        "languagesMap": {},
        "languageFilesMap": {}
    }

});