namespace QuickTemplate.Infrastructures
{
    public static class InfrastructuresDbProperties
    {
        public static string DbTablePrefix { get; set; } = "Infrastructures";

        public static string DbSchema { get; set; } = null;

        public const string ConnectionStringName = "Infrastructures";
    }
}
