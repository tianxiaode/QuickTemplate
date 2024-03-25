# 导入 PSMustache 模块
Import-Module PSMustache

# 加载 Humanizer 模块
Import-Module PowerShellHumanizer

# 定义一个函数来从URL或本地文件获取JSON数据
Function Get-JsonData {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Source
    )

    if ($Source.StartsWith('http')) {
        # 从互联网地址获取JSON数据
        $jsonData = Invoke-RestMethod -Uri $Source
    }
    elseif (Test-Path -Path $Source) {
        # 从本地文件获取JSON数据
        $jsonData = Get-Content -Path $Source -Raw | ConvertFrom-Json
    }
    else {
        Write-Error "无法找到资源：$Source"
        return $null
    }

    return $jsonData
}

# 定义一个函数来生成文件
Function GenerateModelAndStoreFiles {
    param (
        [Parameter(Mandatory = $true)]
        [object]$JsonData,
        [Parameter(Mandatory = $true)]
        [string]$OutputDirectory
    )

    $modelTemplateContent = Get-Content -Path "model.mustache" -Raw
    $storeTemplateContent = Get-Content -Path "store.mustache" -Raw

    $schemas = $JsonData.components.schemas;

    # 假设使用字符串处理（此处简单示例，实际上Powershell内建了很多字符串处理功能）
    foreach ($schema in $schemas.psobject.properties.name) {


        # 如果key中包含ListResult或PagedResult，则跳过        
        if ($schema -match "ListResult|PagedResult|ApplicationConfigurations|AspNetCore.Mvc.|Generic|Http|Validation|NameValue|Account|SettingManagement|FeatureManagement|PermissionManagement") {
            continue
        }

        # 处理properties
        $properties = $schemas.$schema.properties

        if (!$properties) {
            continue
        }

        # #将key中的Volo.替换掉，再把Abp.替换掉，然后拆分
        $namespaces = $schema.Replace("Volo.", "").Replace("Abp.", "").Replace("QuickTemplate", "").Split(".")

        $alias = $namespaces -join ""
        #alias是以identity开头的，则添加abp前缀
        if ($alias.StartsWith("identity")) {
            $alias = "abp" + $alias
        }

        $length = $namespaces.Length
        $path = $namespaces[0..($Length - 2)] -join "."
        $name = $namespaces[$length -1].Replace("Dto", "")

        if($name.StartsWith("II")){
            continue
        }

        $model = [PSCustomObject]@{
            path   = $path.ToLower()
            name   = $name
            alias  = $alias
            fields = @()
        }

        #将model的name转换为复数
        $storeName = $model.name | ConvertTo-Plural

        $store = [PSCustomObject]@{
            name  = $storeName
            path  = $path.ToLower()
            alias = $storeName.ToLower()
            model = $name
        }

        Write-Host "working on $($schema): name=$name, alias=$alias, path=$path, storeName=$storeName"

        foreach ($key in $properties.psobject.properties.name) {

            $prop = $properties.$key
            #如果properties为空，则跳过

            Write-Host "$schema properties: " $propertiy

            #如果属性为id或concurrencyStamp，则跳过
            if ($prop -eq "id" -or $prop -eq "concurrencyStamp") {
                continue
            }

            $field = [PSCustomObject]@{
                fieldName = $prop
            }

            $propType = $prop.type  
            $propFormat = $prop.format

            if ($propType -eq "object" -or $propType -eq "array" -or $propType -eq "") {
            }
            elseif ($propType -eq "boolean") {
                $field | Add-Member -MemberType NoteProperty -Name 'type' -Value "'bool'"
                $field | Add-Member -MemberType NoteProperty -Name 'defaultValue' -Value 'defaultValue: false'
                # $field.type = "'bool'"
                # $field.defaultValue = "defaultValue: false"
            }
            elseif ($propFormat -eq "date-time") {
                $field | Add-Member -MemberType NoteProperty -Name 'type' -Value "'date'"
                #$field.type = "type: 'date'"
            }
            elseif ($propType -eq "integer") {
                $field | Add-Member -MemberType NoteProperty -Name 'type' -Value "'number'"
                # $field.type = "type: 'number'"
                $field | Add-Member -MemberType NoteProperty -Name 'defaultValue' -Value 'defaultValue: 0'
                # $field.defaultValue = "defaultValue: 0"
            }
            else {
                $field | Add-Member -MemberType NoteProperty -Name 'type' -Value "'$propType'"
                # $field.type = "type: '" + $propType + "'"
            }


            $propNullable = $prop.nullable
            #如果propNullable为true，则添加allowBlank定义和defaultValue定义null
            if ($propNullable -eq $true) {
                $field | Add-Member -MemberType NoteProperty -Name 'allowBlank' -Value "allowBlank: true"
                $field | Add-Member -MemberType NoteProperty -Name 'type' -Value "defaultValue: null"
                # $field.allowBlank = "allowBlank: true"
                # $field.defaultValue = "defaultValue: null"
            }

            #如果required数组中包含prop.name，则添加required定义
            if ($required -contains $prop.name) {
                $field | Add-Member -MemberType NoteProperty -Name 'required' -Value "required: truee"
                $field.required = "required: true"
            }

            if ($null -ne $prop.maxLength) {
                $field | Add-Member -MemberType NoteProperty -Name 'maxLength' -Value "maxLength: $prop.maxLength"
            }

            if ($null -ne $prop.minLength) {
                $field | Add-Member -MemberType NoteProperty -Name 'minLength' -Value "minLength: $prop.minLength"
            }
        }


    #     #path不存在则创建
    #     if (!(Test-Path -Path $path)) {
    #         New-Item -ItemType Directory -Force -Path $path | Out-Null
    #     }

    #     #打印文件名和path
    #     Write-Host "生成文件 $($filename) 到 $($path)"

    #     $required = $schema.required


        $model.fields = $model.fields + $field



        #生成model文件
        $modelContent = $modelTemplateContent | Render -Object $model

        $path = $path.Replace(".", "/")
        # 将modelContent写入文件
        $outputDir = $OutputDirectory + "/model/" + $path
        if(!(Test-Path -Path $outputDir)){
            New-Item -ItemType Directory -Force -Path $outputDir.ToLower() | Out-Null
        }
        $filePath = Join-Path -Path $outputDir.ToLower() -ChildPath $filename + ”.js“
        Set-Content -Path $filePath -Value $modelContent -Encoding UTF8

        # 生成store文件
        $storeContent = $storeTemplateContent | Render -Object $store

        # 将storeContent写入文件
        $outputDir = $OutputDirectory + "/store/" + $path 
        if (!(Test-Path -Path $outputDir)) {
            New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
        }
        $filePath = Join-Path -Path $outputDir.ToLower() -ChildPath $storeName + ".js"
        Set-Content -Path $filePath -Value $storeContent -Encoding UTF8
    }

}



# 获取命令行参数
$source = $args[0]
$outputDir = $args[1]

# 获取JSON数据
$jsonData = Get-JsonData -Source $source

if ($jsonData) {
    # 生成文件
    GenerateModelAndStoreFiles -JsonData $jsonData -OutputDirectory $outputDir
}
else {
    Write-Error "未成功获取JSON数据"
}
