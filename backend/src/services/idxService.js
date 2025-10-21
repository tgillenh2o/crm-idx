// Mock IDX adapter for testing/dev
const Property = require('../models/Property');

function mockListings() {
  // A small sample of listings
  return [
    {
      listingId: 'MOCK-1001',
      title: 'Modern 3BR in Town Central',
      description: 'Beautifully remodeled, close to parks.',
      address: { line: '123 Main St', city: 'Piedmont', state: 'OK', postalCode: '73078', lat: 35.0, lng: -97.5 },
      price: 325000,
      beds: 3,
      baths: 2,
      sqft: 1500,
      photos: ['https://placehold.co/600x400?text=House+1'],
      status: 'active',
      source: 'mock',
      raw: {}
    },
    {
      listingId: 'MOCK-1002',
      title: 'Cozy 2BR Bungalow',
      description: 'Quaint bungalow with large yard',
      address: { line: '45 Oak Ave', city: 'Piedmont', state: 'OK', postalCode: '73078', lat: 35.02, lng: -97.52 },
      price: 235000,
      beds: 2,
      baths: 1,
      sqft: 980,
      photos: ['https://placehold.co/600x400?text=House+2'],
      status: 'active',
      source: 'mock',
      raw: {}
    }
  ];
}

async function fetchPropertiesFromProvider(opts = {}) {
  // In production, this would call an IDX provider (RESO, SimplyRETS, IDX Broker)
  // For now return the mock data
  return mockListings();
}

function mapProviderToProperty(item) {
  // already normalized
  return item;
}

async function syncPropertiesToDb() {
  const items = await fetchPropertiesFromProvider();
  const ops = items.map(it => ({
    updateOne: {
      filter: { listingId: it.listingId },
      update: { $set: it },
      upsert: true
    }
  }));
  if (ops.length) await Property.bulkWrite(ops);
  return { synced: ops.length };
}

module.exports = { fetchPropertiesFromProvider, syncPropertiesToDb, mapProviderToProperty };
