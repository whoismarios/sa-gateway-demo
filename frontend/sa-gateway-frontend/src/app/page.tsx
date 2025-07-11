/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { FaServer, FaCodeBranch } from 'react-icons/fa';

import Header from '../components/Header';
import RequestCard from '../components/RequestCard';
import RestCard from '../components/RestCard';
import GraphQLCard from '../components/GraphQLCard';
import OrdersDisplay from '../components/OrdersDisplay';
import CompactOrdersDisplay from '../components/CompactOrdersDisplay';
import ProtocolComparison from '../components/ProtocolComparison';
import { ApiResponse, GraphQLField } from '../types/api';

// Move graphqlFields outside the component to stabilize reference
const graphqlFields: GraphQLField[] = [
  {
    id: 'users',
    name: 'Alle Benutzer',
    query: `{
  users {
    id
    name
    email
    createdAt
    orders {
      id
      product
      quantity
      createdAt
    }
  }
}`
  },
  {
    id: 'userById',
    name: 'Benutzer nach ID',
    query: `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    profile {
      avatar
      bio
    }
    orders {
      id
      product
      quantity
      createdAt
    }
  }
}`
  },
  {
    id: 'searchUsers',
    name: 'Benutzer suchen',
    query: `query SearchUsers($term: String!) {
  searchUsers(term: $term) {
    id
    name
    email
    matchScore
    orders {
      id
      product
      quantity
      createdAt
    }
  }
}`
  },
  {
    id: 'orders',
    name: 'Alle Bestellungen',
    query: `{
  orders {
    id
    product
    quantity
    createdAt
    user {
      id
      name
      email
    }
  }
}`
  },
  {
    id: 'ordersByUser',
    name: 'Bestellungen nach User',
    query: `query GetOrdersByUser($userId: ID!) {
  ordersByUser(userId: $userId) {
    id
    product
    quantity
    createdAt
  }
}`
  }
];

export default function Home() {
  const [results, setResults] = useState<{ [key: string]: ApiResponse }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // GraphQL States
  const [selectedGraphQLField, setSelectedGraphQLField] = useState<string>('users');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userId, setUserId] = useState<number>(1);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [key]: true });
    setTimeout(() => setCopiedStates({ ...copiedStates, [key]: false }), 2000);
  };

  const setResultForType = (type: string, result: ApiResponse) => {
    setResults(prev => ({ ...prev, [type]: { ...result, timestamp: new Date().toISOString() } }));
  };

  const setLoadingForType = (type: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [type]: isLoading }));
  };

  const fetchREST = async () => {
    setLoadingForType('rest', true);
    try {
      const res = await fetch('http://localhost:8080/api/hello');
      const data = await res.json();
      setResultForType('rest', { data, status: res.status });
    } catch (error) {
      setResultForType('rest', { error: (error as Error).message });
    }
    setLoadingForType('rest', false);
  };

  const fetchGraphQL = async () => {
    setLoadingForType('graphql', true);
    try {
      const selectedField = graphqlFields.find(f => f.id === selectedGraphQLField);
      if (!selectedField) return;

      const body: any = { query: selectedField.query };
      // Dynamisch Variablen setzen
      if (selectedField.id === 'userById') {
        body.variables = { id: userId };
      } else if (selectedField.id === 'searchUsers') {
        body.variables = { term: searchTerm };
      } else if (selectedField.id === 'ordersByUser') {
        body.variables = { userId: userId };
      }

      const res = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResultForType('graphql', { data, status: res.status });
    } catch (error) {
      setResultForType('graphql', { error: (error as Error).message });
    }
    setLoadingForType('graphql', false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* REST Request */}
          <RequestCard
            type="rest"
            title="REST API"
            icon={<FaServer className="text-white text-xl" />}
            color="from-blue-500 to-blue-600"
            endpoint="GET /api/hello"
            onExecute={fetchREST}
            results={results}
            loading={loading}
            copiedStates={copiedStates}
            onCopyToClipboard={copyToClipboard}
          >
            <RestCard orders={results.rest?.data?.orders} />
            {results.rest?.data?.orders && (
              <div className="mt-3">
                <CompactOrdersDisplay 
                  orders={results.rest.data.orders} 
                  title="REST Bestellungen" 
                  showUserInfo={true}
                  maxDisplay={3}
                />
              </div>
            )}
          </RequestCard>

          {/* GraphQL Request */}
          <RequestCard
            type="graphql"
            title="GraphQL"
            icon={<FaCodeBranch className="text-white text-xl" />}
            color="from-purple-500 to-purple-600"
            endpoint="POST /graphql"
            onExecute={fetchGraphQL}
            results={results}
            loading={loading}
            copiedStates={copiedStates}
            onCopyToClipboard={copyToClipboard}
          >
            <GraphQLCard
              graphqlFields={graphqlFields}
              selectedGraphQLField={selectedGraphQLField}
              onFieldSelect={setSelectedGraphQLField}
              userId={userId}
              onUserIdChange={setUserId}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
            {results.graphql?.data?.data?.orders && (
              <div className="mt-3">
                <CompactOrdersDisplay 
                  orders={results.graphql.data.data.orders} 
                  title="GraphQL Bestellungen" 
                  showUserInfo={true}
                  maxDisplay={3}
                />
              </div>
            )}
            {results.graphql?.data?.data?.users && results.graphql.data.data.users.some((user: any) => user.orders?.length > 0) && (
              <div className="mt-3">
                <CompactOrdersDisplay 
                  orders={results.graphql.data.data.users.flatMap((user: any) => 
                    user.orders?.map((order: any) => ({
                      ...order,
                      userName: user.name,
                      userEmail: user.email
                    })) || []
                  )} 
                  title="GraphQL User Bestellungen" 
                  showUserInfo={true}
                  maxDisplay={3}
                />
              </div>
            )}
          </RequestCard>

        </div>

        <ProtocolComparison />
      </main>
    </div>
  );
}
