﻿using Generic.Abp.Enumeration.Validation;
using QuickTemplate.Enumerations;
using Volo.Abp.Application.Dtos;

namespace QuickTemplate.Identity.Users;

public class UserGetRolesInput: PagedAndSortedResultRequestDto
{
    public string Filter { get; set; }

    [EnumValue(typeof(SelectedOrNot))]
    public byte Type { get; set; }

    public UserGetRolesInput()
    {
        Type = SelectedOrNot.All.Value;
    }
}