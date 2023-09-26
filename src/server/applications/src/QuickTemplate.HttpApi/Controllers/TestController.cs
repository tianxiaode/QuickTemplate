using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QuickTemplate.Infrastructures;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Authorization;

namespace QuickTemplate.Controllers;

[RemoteService(Name = "Test")]
[Area("test")]
[Route("api/test")]
public class TestController : QuickTemplateController
{
    [HttpGet]
    public Task<ListResultDto<string>> GetAsync()
    {
        return Task.FromResult(new ListResultDto<string>(new List<string>() { "dddddd" }));
    }
}