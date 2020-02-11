var I18N = {

    ApplicationUpdate: '应用程序更新',
    ApplicationUpdateMsg: '应用程序已经更新，重新加载？',

    None: '无',
    All: '全部',
    Dashboard: '仪表面板',
    True: '是',
    False: '否',
    EmptyAllMessage: '清空所有消息',
    AllAsRead: '全部标记为已读',
    DownLoad: '下载',
    IsRead: '已读',

    DateRangeText: '开始日期必须小于结束日期',
    PasswordText: '密码不符合要求',
    CompareText: '两次输入的结果不同',
    PasswordVTypeText: '密码必须由字母和数字组成',
    NotValidMobile: '不是有效的手机号码',
    LettersAndNumbers: '只允许输入字母和数字',
    FormInvalid: '表单数据存在错误, 请更正错误。',

    FailedTitle: '错误信息',
    Failed404: '错误的请求地址',
    Failed500: '服务器内部错误',
    FailedOtherCode: '错误代码：{0}<br\>响应：{1}',

    AppTitle: '快速模版',
    Company: '公司名称',
    CompanyFullName: '公司全称',
    ICP: '粤ICP备xxxxxxxx号-1',
    CompanyWebsite: '#',    
    CopyrightStartValue: '',
    BrowserIsNotCompatible: '浏览器不兼容',
    SupportedBrowsers: '<div>支持的浏览器包括<a href="https://www.google.cn/chrome/index.html">Chorme</a>、<a href="https://www.mozilla.org/en-US/firefox/all/">Firefox</a>、<a href="https://browser.qq.com/">QQ浏览器</a>等非IE浏览器，请自行下载并安装。</div>',

    DefaultMessageTitle: '信息',
    GetUserInfo: '加载用户信息......',
    StateRestoreWait: '恢复状态信息...',
    EmptyText: '没有任何数据',
    IndexLoadingText: '加载中......',

    ComingSoon: '即将推出！',
    StayTunedForUpdates: '敬请期待。',
    Error404HTML: '<div>页面不存在，尝试返回<a href="/">首页</a></div>',
    Error500HTML: '<div>服务器内部错误，尝试返回<a href="/">首页</a></div>',

    DefaultDatetimeFormat: 'Y-m-d H:i:s',
    DefaultDateFormat: 'Y-m-d',
    DefaultDatetimeIsoFormat: 'C',
    AM: '上午',
    PM: '下午',
    Year: '年',
    Month: '月',
    DayText: '日',
    Hour: '小时',
    Minute: '分钟',
    Second: '秒',
    Milliseconds: '微秒',
    InvalidDate: '无效日期',
    StartDateGreater: '开始时间大于结束时间',
    EndDateLess: '结束时间小于开始时间',
    MinDateErrorText: "日期必须大于最小允许日期",
    MaxDateErrorText: '日期必须小于最大允许日期',
    LabelSeparator: '：',
    Success: '成功',
    Failure: '失败',

    Logout: '退出',
    LogoutMessage: '确定退出系统？',
    LoginTitle: '登录',
    LoginLabel: '使用帐号登录',
    LoginSubmitWaitMsg: '正在登录，请等待......',
    LoginSubmitWaitTitle: '正在登录',
    PasswordResetTitle: '修改密码',
    PasswordResetLabel: '输入以下字段以修改密码',
    PasswordResetSuccess: '密码已修改，请重新登录',
    OldPasswordEqualNew: '新密码不能与旧密码相同',
    Reset: '重置',
    UserId: '用户名',
    Password: '密码',
    NewPassword: '新密码',
    PasswordRegexText: '密码必须由字母和数字组成,且长度至少为6位',
    ConfirmPassword: '确认密码',
    RememberMe: '记住我',
    ForgotPassword: '忘记密码',
    ResetPassword: '重置密码',
    EnterNewPassword: '输入新密码',
    EnterEmail: '请输入邮件地址',

    Save: '保存',
    CloseToolText: '关闭',
    SaveWaitMsg: '正在保存，请等待......',
    SavedAndClose: '数据已成功保存，窗口将关闭',
    SavedAndNothing: '数据已成功保存',
    SavedAndNew: '数据已成功保存，可继续添加新的数据',
    Return: '返回',
    Required: '该输入项为必输项',
    InvalidValue: '输入值为无效值',
    RequiredTips: '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>号为必填',
    RequiredTpl: [
        '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
    ],
    PasswordNoEqual: '两次输入的密码不同',
    Count: '共{0}条',

    Paging:{
        First: '第一页',
        Prev: '上一页',
        Next: "下一页",
        beforePageText: "第",
        //update
        afterPageText: "页,共 {0} 页",
        //update
        firstText: "第一页",
        prevText: "上一页",
        //update
        lastText: "最后页",
        refreshText: "刷新",
        displayMsg: "显示 {0} - {1}条，共 {2} 条",
        //update
        emptyMsg: '没有数据'
    },

    DeleteNoSelection: '请选择要删除的{0}',
    DeleteWaitMsg: '正在删除，请等待……',
    DeleteConfirmMessageTitle: '删除',
    DeleteConfirmMessage: '<p>确定要删除以下{0}？</p>{1}',
    DeleteAllConfirmMessage: '<p>确认要删除所选的全部数据？</p><p style="color:red;">注意：部分数据可能因条件限制删除不了！</p>',
    DeleteSuccess: '数据已删除',

    Add: '新建',
    Edit: '编辑',
    Delete: '删除',
    Details: '详细信息',
    ShowDetails: '查看详细信息',
    Refresh: '刷新',
    Search: '查询',
    CancelSearch: '取消查询',
    OK: '确定',
    Cancel: '取消',
    Selected: '选择',
    Copy: '复制',
    NoModel: '没有定义模型',
    NoSelection: '请选择{0}，再{1}',
    SelectItem: '请选择一个条目',
    Loading: '正在加载数据，请等待......',
    Loaded: '已加载',
    SaveAndNewButtonText: '保存和新建',
    SaveButtonText: '保存',
    PasswordNoChange: '注意：如果不修改密码，可留空',
    Sorter: '排序',
    SorterASC: '正序',
    SorterDESC: '倒序',
    EmptyValue: '无',
    Help: '帮助',
    PhoneRegex: '只允许输入数字、横线(-)和空格',
    Keyword: '关键字',
    Update: '更新',
    Updating: '正在更新...',
    Updated: '信息已更新！',
    UpdatedByItem: '{0} 已更新',
    NoDefine: '未定义',

    SearchDate: '日期：',
    SearchText: '文本：',
    SearchStart: '开始/取消搜索',
    NoSearchValue: '请输入正确的搜索值再进行搜索',
    SearchCompareErrorMessage: '开始{0}不能大于或等于结束{0}',
    Compare: '比较',
    FileUpload: '上传',
    FileUploadError: '文件“{0}”不能上传，错误：{1}',
    FileUploaded: '文件{0}已上传',

    User: '用户',
    Role: '角色',
    Permissions: '权限',
    Organization: '组织',
    Province: '省份',
    City: '城市',
    District: '地区',
    PullRefresh:{
        pullText: '刷新',
        releaseText: '释放',
        loadingText: '加载中...',
        loadedText: '已加载',
        lastUpdatedText: '最后更新：&nbsp;'
    },
    UxField: '扩展字段',
    UxDateField: '扩展日期字段',
    UxDateTimeField: '扩展日期时间字段',
    DistrictField: '地区字段',
    ImageField: '选择图片字段',
    TimePeriod: '时间区间',
    TestToast: '测试Toast',

    Model: {
        User: {
            userName: '用户名',
            surname: '姓名',
            organizationName: '所属组织',
            name: '名称',
            roles: '角色',
            emailAddress: '邮件地址',
            creationTime: '创建日期',
            isLockout: '已锁定',
            isActive: '已激活',
            password: '密码',
        },
        Role: {
            name: '角色名',
            displayName: '角色名',
            creationTime: '创建时间',
            description: '描述',
            permissions: '权限',
            displayPermissions: '权限',
        },
        PermissionsGrid: {
            name: '页面',
            read: '访问',
            create: '添加',
            edit: '编辑',
            delete: '删除',
        },
        OrganizationUnit: {
            displayName: '名称',
            code: '编码',
            parentId: '父编号',
            parentName: '父组织'
        },
    },
    ValueList: {
        deleteMessage: ['## <i style="color:red">{0}</i> 已删除', '## <i style="color:#ffc037">{0}</i> 未能删除'],
    },


    init: function (profile) {
        document.title = I18N.AppTitle;
        this.initPhone();
    }, //init

    initPhone: function () {
        if (Ext.Date) {
            Ext.Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

            Ext.Date.dayNames = ["日", "一", "二", "三", "四", "五", "六"];

            Ext.Date.defaultFormat = I18N.DefaultDateFormat;
            Ext.Date.defaultTimeFormat = 'H:i:ss';

            Ext.Date.getShortMonthName = function (month) {
                return Ext.Date.monthNames[month].substring(0, 3);
            };

            Ext.Date.monthNumbers = {
                Jan: 0,
                Feb: 1,
                "M\u00e4r": 2,
                Apr: 3,
                Mai: 4,
                Jun: 5,
                Jul: 6,
                Aug: 7,
                Sep: 8,
                Okt: 9,
                Nov: 10,
                Dez: 11
            };

            Ext.Date.getMonthNumber = function (name) {
                return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
            };


            Ext.Date.getShortDayName = function (day) {
                return Ext.Date.dayNames[day].substring(0, 3);
            };
        }

        if (Ext.util && Ext.util.Format) {
            Ext.util.Format.defaultDateFormat = I18N.DefaultDateFormat;
            Ext.util.Format.__number = Ext.util.Format.number;
            Ext.util.Format.number = function (v, format) {
                return Ext.util.Format.__number(v, format || "0.000,00/i");
            };

            Ext.apply(Ext.util.Format, {
                thousandSeparator: ',',
                decimalSeparator: '.',
                currencySign: '￥',
                // German Euro
                dateFormat: 'd.m.Y'
            });
        }


        Ext.Msg._standardButtons.ok.text = '确定';
        Ext.Msg._standardButtons.ok.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.ok.ui = 'action';
        Ext.Msg._standardButtons.abort.text = '取消';
        Ext.Msg._standardButtons.abort.ui = 'soft-grey';
        Ext.Msg._standardButtons.abort.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.retry.text = '重试';
        Ext.Msg._standardButtons.retry.ui = 'action';
        Ext.Msg._standardButtons.retry.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.ignore.text = '忽略';
        Ext.Msg._standardButtons.ignore.ui = 'soft-grey';
        Ext.Msg._standardButtons.ignore.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.yes.text = '是';
        Ext.Msg._standardButtons.yes.ui = 'action';
        Ext.Msg._standardButtons.yes.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.no.text = '否';
        Ext.Msg._standardButtons.no.ui = 'soft-grey';
        Ext.Msg._standardButtons.no.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.cancel.text = '取消';
        Ext.Msg._standardButtons.cancel.ui = 'soft-grey';
        Ext.Msg._standardButtons.cancel.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.apply.text = '应用';
        Ext.Msg._standardButtons.apply.ui = 'action';
        Ext.Msg._standardButtons.apply.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.submit.text = '提交';
        Ext.Msg._standardButtons.submit.ui = 'action';
        Ext.Msg._standardButtons.submit.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.save.text = '保存';
        Ext.Msg._standardButtons.save.ui = 'action';
        Ext.Msg._standardButtons.save.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.close.text = '关闭';
        Ext.Msg._standardButtons.close.ui = 'soft-grey';
        Ext.Msg._standardButtons.close.margin = '0 0 0 5px';
        Ext.Msg._standardButtons.help.text = '帮助';
        Ext.Msg._standardButtons.help.ui = 'soft-green';
        Ext.Msg._standardButtons.help.margin = '0 0 0 5px';

        this.doOverrides(I18N.phoneOverrides);
    },

    doOverrides: function (overrides) {
        Ext.Object.each(overrides, function (key, value, myself) {
            var cls = Ext.ClassManager.get(key);
            if (cls) {
                if (key == "Ext.form.field.VTypes") {
                    value.daterangeText = I18N.DaterangeText;
                    value.compareText = I18N.CompareText;
                    value.passwordText = I18N.PasswordText;
                }
                Ext.override(cls, value);
            }
        });
    },

    phoneOverrides: {
        "Ext.Panel": {
            config: {
                standardButtons: {
                    ok: {
                        text: '确定'
                    },
                    abort: {
                        text: '取消'
                    },
                    retry: {
                        text: '再试一次'
                    },
                    ignore: {
                        text: '忽略'
                    },
                    yes: {
                        text: '是'
                    },
                    no: {
                        text: '否'
                    },
                    cancel: {
                        text: '取消'
                    },
                    apply: {
                        text: '应用'
                    },
                    save: {
                        text: '保存'
                    },
                    submit: {
                        text: '提交'
                    },
                    help: {
                        text: '帮助'
                    },
                    close: {
                        text: '关闭'
                    }
                },
                closeToolText: '关闭面板'
            }
        },
        "Ext.picker.Date": {
            config: {
                doneButton: '完成',
                monthText: '月',
                dayText: '日',
                yearText: '年'
            }
        },
        "Ext.picker.Picker": {
            config: {
                doneButton: '确定',
                cancelButton: '取消'
            }
        },
        "Ext.panel.Date": {
            config: {
                nextText: '下个月)',
                prevText: '上个月)',
                buttons: {
                    footerTodayButton: {
                        text: "今天"
                    }
                }
            }
        },
        "Ext.panel.Collapser": {
            config: {
                collapseToolText: "隐藏面板",
                expandToolText: "展开面板"
            }
        },
        "Ext.field.Field": {
            config: {
                requiredMessage: '该输入项为必输项',
                validationMessage: '格式错误'
            }
        },
        "Ext.field.Number": {
            decimalsText: '最大小数点位置为 {0}',
            minValueText: '该输入项的最小值是 {0}',
            maxValueText: '该输入项的最大值是 {0}',
            badFormatMessage: '{0} 不是有效数值'
        },
        "Ext.field.Text": {
            badFormatMessage: '该值与所需格式不匹配',
            config: {
                autoComplete: false,
                requiredMessage: '该输入项为必输项',
                validationMessage: '格式错误'
            }
        },
        "Ext.Dialog": {
            config: {
                maximizeTool: {
                    tooltip: "最大化"
                },
                restoreTool: {
                    tooltip: "还原为原始大小"
                }
            }
        },
        "Ext.field.FileButton": {
            config: {
                text: '浏览...'
            }
        },
        "Ext.dataview.List": {
            config: {
                loadingText: '读取中 ...'
            }
        },
        "Ext.dataview.EmptyText": {
            config: {
                html: '没有要显示的数据'
            }
        },
        "Ext.dataview.Abstract": {
            cachedConfig: {
                loadingText: '读取中 ...'
            }
        },
        "Ext.LoadMask": {
            config: {
                message: '读取中 ...'
            }
        },
        "Ext.dataview.plugin.ListPaging": {
            config: {
                loadMoreText: '更多...',
                noMoreRecordsText: '没有更多数据了'
            }
        },
        "Ext.dataview.DataView": {
            config: {
                emptyText: ""
            }
        },
        "Ext.field.Date": {
            minDateMessage: '该输入项的日期必须在 {0} 之后',
            maxDateMessage: '该输入项的日期必须在 {0} 之前'
        },
        "Ext.grid.menu.SortAsc": {
            config: {
                text: "升序排序"
            }
        },
        "Ext.grid.menu.SortDesc": {
            config: {
                text: "降序排序"
            }
        },
        "Ext.grid.menu.GroupByThis": {
            config: {
                text: "按此字段分组"
            }
        },
        "Ext.grid.menu.ShowInGroups": {
            config: {
                text: "以组显示"
            }
        },
        "Ext.grid.menu.Columns": {
            config: {
                text: "列"
            }
        },
        "Ext.data.validator.Presence": {
            config: {
                message: '必须存在'
            }
        },
        "Ext.data.validator.Format": {
            config: {
                message: '格式错误'
            }
        },
        "Ext.data.validator.Email": {
            config: {
                message: '不是有效的电子邮件地址'
            }
        },
        "Ext.data.validator.Phone": {
            config: {
                message: '不是有效电话号码'
            }
        },
        "Ext.data.validator.Number": {
            config: {
                message: '不是数字'
            }
        },
        "Ext.data.validator.Url": {
            config: {
                message: '不是有效的 URL'
            }
        },
        "Ext.data.validator.Range": {
            config: {
                nanMessage: '不是有效数字',
                minOnlyMessage: '此字段的最小值为 {0}',
                maxOnlyMessage: '此字段的最大值为 {0}',
                bothMessage: '必须介于 {0} 和 {1} 之间'
            }
        },
        "Ext.data.validator.Bound": {
            config: {
                emptyMessage: '必须存在',
                minOnlyMessage: '值必须大于 {0}',
                maxOnlyMessage: '值必须小于 {0}',
                bothMessage: '值必须介于 {0} 和 {1} 之间'
            }
        },
        "Ext.data.validator.CIDRv4": {
            config: {
                message: '不是有效的 CIDR 块'
            }
        },
        "Ext.data.validator.CIDRv6": {
            config: {
                message: '不是有效的 CIDR 块'
            }
        },
        "Ext.data.validator.Currency": {
            config: {
                message: '不是有效的货币金额'
            }
        },
        "Ext.data.validator.DateTime": {
            config: {
                message: '不是有效的日期和时间'
            }
        },
        "Ext.data.validator.Exclusion": {
            config: {
                message: '是已排除的值'
            }
        },
        "Ext.data.validator.IPAddress": {
            config: {
                message: '不是有效的 IP 地址'
            }
        },
        "Ext.data.validator.Inclusion": {
            config: {
                message: '不包含在 "允许的值" 列表中'
            }
        },
        "Ext.data.validator.Time": {
            config: {
                message: '不是有效时间'
            }
        },
        "Ext.data.validator.Date": {
            config: {
                message: "不是有效日期"
            }
        },
        "Ext.data.validator.Length": {
            config: {
                minOnlyMessage: '长度必须至少为 {0}',
                maxOnlyMessage: '长度不能超过 {0}',
                bothMessage: '长度必须介于 {0} 和 {1} 之间'
            }
        }
    }
};