# Paths
$packFolder = (Get-Item -Path "./" -Verbose).FullName
$rootFolder = Join-Path $packFolder "../src/server"

# List of solutions
$solutions = (
    "modules/QuickTemplate.Infrastructures"
)

# List of projects
$projects = (

    # modules/Infrastructures
    "modules/QuickTemplate.Infrastructures/src/QuickTemplate.Infrastructures.Domain.Shared",
    "modules/QuickTemplate.Infrastructures/src/QuickTemplate.Infrastructures.Domain",
    "modules/QuickTemplate.Infrastructures/src/QuickTemplate.Infrastructures.EntityFrameworkCore",
    "modules/QuickTemplate.Infrastructures/src/QuickTemplate.Infrastructures.Application.Contracts",
    "modules/QuickTemplate.Infrastructures/src/QuickTemplate.Infrastructures.Application",
    "modules/QuickTemplate.Infrastructures/src/QuickTemplate.Infrastructures.HttpApi"

        
)
