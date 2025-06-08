export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Configure your LinkedIn CRM preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border bg-white dark:bg-zinc-900/30 p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Coming Soon
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Settings features are under development
          </p>
        </div>
      </div>
    </div>
  );
}
