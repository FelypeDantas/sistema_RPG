export const TraitsCard = ({ traits }) => (
  <div className="bg-cyber-card p-4 rounded-xl">
    <h3 className="text-white mb-3">Traits</h3>

    <ul className="space-y-2 text-sm text-gray-300">
      {traits.map(t => (
        <li key={t.id}>
          ✦ <span className="text-white">{t.name}</span>
          <p className="text-xs text-gray-500">{t.description}</p>
        </li>
      ))}
    </ul>
  </div>
);
