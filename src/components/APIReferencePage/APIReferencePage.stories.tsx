import type { Meta, StoryObj } from '@storybook/react';
import { APIReferencePage } from './APIReferencePage';
import type { ResponseEntry } from '../CodeBlock/ResponseBlock';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sample data                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

const FETCH_BILL_SCHEMA = {
  type: 'object',
  title: 'FetchBillRequest',
  required: ['agent', 'customerIdentifiers'],
  properties: {
    agent: {
      type: 'object',
      title: 'Agent',
      description: 'Identifies the calling agent / system.',
      required: ['id', 'secret'],
      properties: {
        id:     { type: 'string',  description: 'Agent identifier',  example: 'agent_abc123' },
        secret: { type: 'string',  description: 'Agent secret key',  format: 'password'      },
      },
    },
    customerIdentifiers: {
      type: 'array',
      description: 'One or more customer identifiers used to look up the bill.',
      items: {
        type: 'object',
        title: 'CustomerIdentifier',
        required: ['type', 'value'],
        properties: {
          type:  { type: 'string', enum: ['ACCOUNT_NUMBER', 'MOBILE', 'EMAIL', 'NATIONAL_ID'], description: 'Identifier type' },
          value: { type: 'string', description: 'The actual identifier value', example: '0712345678' },
        },
      },
    },
    billerIds: {
      type: 'array',
      description: 'Optionally restrict results to specific billers.',
      items: { type: 'string', description: 'Biller ID', example: 'BILLER_001' },
    },
    options: {
      type: 'object',
      title: 'FetchOptions',
      description: 'Optional fetch configuration.',
      properties: {
        maxResults:   { type: 'integer', description: 'Max number of bills to return', minimum: 1, maximum: 100, default: 10 },
        includeVoid:  { type: 'boolean', description: 'Include voided bills in the response', default: false },
        dateFrom:     { type: 'string',  description: 'Filter bills from this date (ISO 8601)', format: 'date', example: '2024-01-01' },
        dateTo:       { type: 'string',  description: 'Filter bills up to this date (ISO 8601)', format: 'date', example: '2024-12-31' },
      },
    },
  },
};

const BILL_RESPONSE_SCHEMA = {
  type: 'object',
  title: 'FetchBillResponse',
  properties: {
    bills: {
      type: 'array',
      description: 'List of matched bills.',
      items: {
        type: 'object',
        title: 'Bill',
        properties: {
          billId:      { type: 'string',  description: 'Unique bill identifier', example: 'BILL_XYZ789' },
          amount:      { type: 'number',  description: 'Bill amount in the currency unit', example: 1500.00 },
          currency:    { type: 'string',  description: 'ISO 4217 currency code', example: 'KES' },
          dueDate:     { type: 'string',  description: 'Bill due date', format: 'date', example: '2024-03-31' },
          status:      { type: 'string',  enum: ['PENDING', 'PAID', 'OVERDUE', 'VOID'], description: 'Current bill status' },
          description: { type: 'string',  description: 'Human-readable bill description' },
        },
      },
    },
    totalCount: { type: 'integer', description: 'Total number of matched bills before pagination' },
    hasMore:    { type: 'boolean', description: 'Whether more results are available' },
  },
};

const ERROR_SCHEMA = {
  type: 'object',
  title: 'ErrorResponse',
  properties: {
    code:    { type: 'string',  description: 'Machine-readable error code', example: 'INVALID_AGENT' },
    message: { type: 'string',  description: 'Human-readable error description' },
    details: { type: 'array',  items: { type: 'string' }, description: 'Additional error context' },
  },
};

const CODE_SAMPLES = {
  shell: `curl -X POST https://api.docuwiz.io/v1/bills/fetch \\
  -H "Content-Type: application/json" \\
  -H "X-Api-Key: YOUR_API_KEY" \\
  -d '{
    "agent": {
      "id": "agent_abc123",
      "secret": "s3cr3t_k3y"
    },
    "customerIdentifiers": [
      {
        "type": "MOBILE",
        "value": "0712345678"
      }
    ]
  }'`,

  javascript: `const response = await fetch('https://api.docuwiz.io/v1/bills/fetch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': 'YOUR_API_KEY',
  },
  body: JSON.stringify({
    agent: {
      id: 'agent_abc123',
      secret: 's3cr3t_k3y',
    },
    customerIdentifiers: [
      { type: 'MOBILE', value: '0712345678' },
    ],
  }),
});

const data = await response.json();
console.log(data);`,

  python: `import requests

response = requests.post(
    'https://api.docuwiz.io/v1/bills/fetch',
    headers={
        'Content-Type': 'application/json',
        'X-Api-Key': 'YOUR_API_KEY',
    },
    json={
        'agent': {
            'id': 'agent_abc123',
            'secret': 's3cr3t_k3y',
        },
        'customerIdentifiers': [
            {'type': 'MOBILE', 'value': '0712345678'},
        ],
    }
)
data = response.json()
print(data)`,
};

const SAMPLE_RESPONSE: ResponseEntry[] = [
  {
    code: 200,
    text: 'OK',
    language: 'json',
    body: JSON.stringify(
      {
        bills: [
          {
            billId: 'BILL_XYZ789',
            amount: 1500.00,
            currency: 'KES',
            dueDate: '2024-03-31',
            status: 'PENDING',
            description: 'Monthly utility bill — March 2024',
          },
        ],
        totalCount: 1,
        hasMore: false,
      },
      null,
      2
    ),
  },
];

const ENVIRONMENTS = [
  { label: 'Production',  url: 'https://api.docuwiz.io' },
  { label: 'Staging',     url: 'https://staging.api.docuwiz.io' },
  { label: 'Sandbox',     url: 'https://sandbox.api.docuwiz.io' },
];

const HEADER_PARAMS = [
  {
    name: 'X-Api-Key',
    in: 'header' as const,
    required: true,
    type: 'string',
    description: 'Your API key for authentication. Obtain it from the developer dashboard.',
    example: 'apk_live_abc123…',
  },
  {
    name: 'X-Request-Id',
    in: 'header' as const,
    required: false,
    type: 'string',
    description: 'Optional idempotency key. If provided, duplicate requests with the same key return the cached response for 24 hours.',
    example: 'req_20240315_001',
  },
  {
    name: 'Accept-Language',
    in: 'header' as const,
    required: false,
    type: 'string',
    description: 'BCP 47 language tag. Controls the language of error messages and descriptions.',
    example: 'en-US',
  },
];

const NAV_SECTIONS = [
  {
    label: 'Bills API',
    variant: 'category' as const,
    groups: [
      {
        label: 'Bills',
        defaultExpanded: true,
        items: [
          { label: 'Fetch Bill',   method: 'POST' as const, active: true  },
          { label: 'Pay Bill',     method: 'POST' as const                },
          { label: 'Get Bill',     method: 'GET'  as const                },
          { label: 'List Bills',   method: 'GET'  as const                },
          { label: 'Cancel Bill',  method: 'DELETE' as const              },
        ],
      },
      {
        label: 'Billers',
        defaultExpanded: false,
        items: [
          { label: 'List Billers', method: 'GET'  as const },
          { label: 'Get Biller',   method: 'GET'  as const },
        ],
      },
    ],
  },
  {
    label: 'Payments',
    variant: 'category' as const,
    groups: [
      {
        label: 'Transactions',
        defaultExpanded: false,
        items: [
          { label: 'Initiate Payment', method: 'POST' as const },
          { label: 'Get Transaction',  method: 'GET'  as const },
          { label: 'List Transactions',method: 'GET'  as const },
        ],
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Meta                                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

const meta: Meta<typeof APIReferencePage> = {
  title: 'Pages/APIReferencePage',
  component: APIReferencePage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page API reference layout. Toggle between **Schema** mode (read-only documentation) ' +
          'and **Tryout** mode (live request editing with Input fields). ' +
          'The right panel always shows code samples and responses.',
      },
    },
  },
  argTypes: {
    method: {
      control: 'select',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof APIReferencePage>;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Stories                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

/** Default — full featured Fetch Bill endpoint. */
export const Default: Story = {
  args: {
    method: 'POST',
    path: '/v1/bills/fetch',
    title: 'Fetch Bill',
    description:
      'Retrieve one or more bills matching the supplied customer identifiers. Optionally filter by biller IDs, date range, or include voided bills. Results are paginated — use `options.maxResults` and cursor pagination for large result sets.',
    breadcrumb: ['API Reference', 'Bills', 'Fetch Bill'],
    headerParameters: HEADER_PARAMS,
    requestBodySchema: FETCH_BILL_SCHEMA,
    requestBodyContentType: 'application/json',
    responses: [
      {
        statusCode: '200',
        description: 'Bills retrieved successfully.',
        schema: BILL_RESPONSE_SCHEMA,
      },
      {
        statusCode: '400',
        description: 'Invalid request payload.',
        schema: ERROR_SCHEMA,
      },
      {
        statusCode: '401',
        description: 'Missing or invalid API key.',
        schema: ERROR_SCHEMA,
      },
      {
        statusCode: '429',
        description: 'Rate limit exceeded. Retry after the interval specified in `Retry-After`.',
        schema: ERROR_SCHEMA,
      },
    ],
    codeSamples: CODE_SAMPLES,
    defaultLanguage: 'shell',
    sampleResponses: SAMPLE_RESPONSE,
    environments: ENVIRONMENTS,
    navSections: NAV_SECTIONS,
    onRun: async (_lang, _code) => {
      /* Simulated 1-second network delay */
      await new Promise((r) => setTimeout(r, 1000));
      return {
        code: 200,
        text: 'OK',
        language: 'json',
        body: JSON.stringify(
          {
            bills: [
              {
                billId: 'BILL_XYZ789',
                amount: 1500.00,
                currency: 'KES',
                dueDate: '2024-03-31',
                status: 'PENDING',
                description: 'Monthly utility bill — March 2024',
              },
            ],
            totalCount: 1,
            hasMore: false,
          },
          null,
          2
        ),
      };
    },
  },
};

/** Dark mode — same content on a dark background. */
export const DarkMode: Story = {
  ...Default,
  decorators: [
    (Story) => (
      <div data-theme="dark">
        <Story />
      </div>
    ),
  ],
};

/** Without navigation — no sidebar, more horizontal space for content. */
export const NoSidebar: Story = {
  args: {
    ...Default.args,
    navSections: [],
  },
};

/** Schema-only — no request body, query params only. */
export const GetEndpoint: Story = {
  args: {
    method: 'GET',
    path: '/v1/bills/{billId}',
    title: 'Get Bill',
    description: 'Retrieve a single bill by its unique identifier.',
    breadcrumb: ['API Reference', 'Bills', 'Get Bill'],
    headerParameters: [HEADER_PARAMS[0]],
    queryParameters: [
      {
        name: 'include',
        in: 'query' as const,
        required: false,
        type: 'string',
        description: 'Comma-separated list of related resources to include in the response.',
        example: 'biller,customer',
      },
    ],
    responses: [
      { statusCode: '200', description: 'Bill found.', schema: BILL_RESPONSE_SCHEMA },
      { statusCode: '404', description: 'Bill not found.', schema: ERROR_SCHEMA },
    ],
    codeSamples: {
      shell: `curl -X GET https://api.docuwiz.io/v1/bills/BILL_XYZ789 \\
  -H "X-Api-Key: YOUR_API_KEY"`,
      javascript: `const response = await fetch('https://api.docuwiz.io/v1/bills/BILL_XYZ789', {
  headers: { 'X-Api-Key': 'YOUR_API_KEY' },
});
const bill = await response.json();`,
    },
    environments: ENVIRONMENTS,
    navSections: NAV_SECTIONS,
  },
};
