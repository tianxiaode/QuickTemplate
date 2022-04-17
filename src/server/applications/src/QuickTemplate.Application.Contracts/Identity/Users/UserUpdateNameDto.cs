﻿using System.ComponentModel;
using Volo.Abp.Identity;
using Volo.Abp.Validation;

namespace QuickTemplate.Identity.Users;

public class UserUpdateNameDto
{
    [DynamicStringLength(typeof(IdentityUserConsts), nameof(IdentityUserConsts.MaxNameLength))]
    [DisplayName("DisplayName:Name")]
    public string Value { get; set; }

}