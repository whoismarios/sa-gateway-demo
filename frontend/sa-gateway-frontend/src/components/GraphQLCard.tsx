import { FaCodeBranch, FaUser, FaSearch } from 'react-icons/fa';

interface GraphQLField {
  id: string;
  name: string;
  query: string;
}

interface GraphQLCardProps {
  graphqlFields: GraphQLField[];
  selectedGraphQLField: string;
  onFieldSelect: (fieldId: string) => void;
  userId: number;
  onUserIdChange: (userId: number) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

function GraphQLUserIdInput({ value, onChange, visible }: { value: number; onChange: (v: number) => void; visible: boolean }) {
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <FaUser className="inline mr-1" />
        Benutzer-ID
      </label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        min="1"
      />
    </div>
  );
}

function GraphQLSearchInput({ value, onChange, visible }: { value: string; onChange: (v: string) => void; visible: boolean }) {
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <FaSearch className="inline mr-1" />
        Suchbegriff
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Name oder E-Mail eingeben..."
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
}

export default function GraphQLCard({
  graphqlFields,
  selectedGraphQLField,
  onFieldSelect,
  userId,
  onUserIdChange,
  searchTerm,
  onSearchTermChange
}: GraphQLCardProps) {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <FaCodeBranch className="text-purple-600" />
          <span className="font-medium text-purple-900">Query Language</span>
        </div>
        <p className="text-sm text-purple-800">
          Flexible Abfragesprache für APIs. Definieren Sie genau welche Daten Sie benötigen.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Query-Typ auswählen
        </label>
        <div className="space-y-2">
          {graphqlFields.map((field) => (
            <label key={field.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="graphqlField"
                value={field.id}
                checked={selectedGraphQLField === field.id}
                onChange={(e) => onFieldSelect(e.target.value)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{field.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dynamic inputs based on selected field */}
      <GraphQLUserIdInput
        value={userId}
        onChange={onUserIdChange}
        visible={selectedGraphQLField === 'userById'}
      />
      <GraphQLSearchInput
        value={searchTerm}
        onChange={onSearchTermChange}
        visible={selectedGraphQLField === 'searchUsers'}
      />

      {/* Query Preview */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-2">Query Preview:</p>
        <pre className="text-xs text-green-400 font-mono overflow-x-auto">
          {graphqlFields.find(f => f.id === selectedGraphQLField)?.query}
        </pre>
      </div>
    </div>
  );
} 