import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TryoutPanel }   from './TryoutPanel';
import { EndpointBlock } from './EndpointBlock';
import { ResponseBlock } from './ResponseBlock';
import { CodeBlock }     from './CodeBlock';
import type { ResponseEntry } from './ResponseBlock';

/* =============================================================================
   Code samples — one per language, same endpoint
   ============================================================================= */

const SAMPLES = {
  shell: `curl --location 'https://sandbox.setu.co/api/v2/bbps/bills/fetch/request' \\
--header 'Content-Type: application/json' \\
--header 'X-Setu-Product-Instance-ID: prod-instance-xxxx-xxxx' \\
--header 'Authorization: Bearer eyJhbGci0iJSUzI1NiJ9...' \\
--data '{
  "customerIdentifiers": [
    {
      "attributeName": "mobileNumber",
      "attributeValue": "9999999999"
    }
  ],
  "agent": {
    "app": "setuBillPay",
    "channel": "INT",
    "geocode": "28.6139,77.2090",
    "id": "agent-001",
    "mobile": "9999999999",
    "type": "BUSINESS"
  },
  "billerIds": ["MAHA0000ELEC001"],
  "fetchRequirement": "BILLS"
}'`,

  javascript: `const response = await fetch(
  'https://sandbox.setu.co/api/v2/bbps/bills/fetch/request',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Setu-Product-Instance-ID': 'prod-instance-xxxx-xxxx',
      'Authorization': 'Bearer eyJhbGci0iJSUzI1NiJ9...',
    },
    body: JSON.stringify({
      customerIdentifiers: [
        { attributeName: 'mobileNumber', attributeValue: '9999999999' },
      ],
      agent: {
        app: 'setuBillPay',
        channel: 'INT',
        geocode: '28.6139,77.2090',
        id: 'agent-001',
        mobile: '9999999999',
        type: 'BUSINESS',
      },
      billerIds: ['MAHA0000ELEC001'],
      fetchRequirement: 'BILLS',
    }),
  }
);
const data = await response.json();
console.log(data);`,

  python: `import requests, json

url = "https://sandbox.setu.co/api/v2/bbps/bills/fetch/request"

headers = {
    "Content-Type": "application/json",
    "X-Setu-Product-Instance-ID": "prod-instance-xxxx-xxxx",
    "Authorization": "Bearer eyJhbGci0iJSUzI1NiJ9...",
}

payload = {
    "customerIdentifiers": [
        {"attributeName": "mobileNumber", "attributeValue": "9999999999"}
    ],
    "agent": {
        "app": "setuBillPay",
        "channel": "INT",
        "geocode": "28.6139,77.2090",
        "id": "agent-001",
        "mobile": "9999999999",
        "type": "BUSINESS",
    },
    "billerIds": ["MAHA0000ELEC001"],
    "fetchRequirement": "BILLS",
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`,

  java: `import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();

String body = """
    {
      "customerIdentifiers": [
        { "attributeName": "mobileNumber", "attributeValue": "9999999999" }
      ],
      "agent": {
        "app": "setuBillPay",
        "channel": "INT",
        "id": "agent-001",
        "type": "BUSINESS"
      },
      "billerIds": ["MAHA0000ELEC001"],
      "fetchRequirement": "BILLS"
    }
    """;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create(
        "https://sandbox.setu.co/api/v2/bbps/bills/fetch/request"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer eyJhbGci0iJSUzI1NiJ9...")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response =
    client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

  python: `import requests

url = "https://sandbox.setu.co/api/v2/bbps/bills/fetch/request"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGci0iJSUzI1NiJ9...",
}
payload = {
    "customerIdentifiers": [{"attributeName": "mobileNumber", "attributeValue": "9999999999"}],
    "agent": {"app": "setuBillPay", "channel": "INT", "id": "agent-001", "type": "BUSINESS"},
    "billerIds": ["MAHA0000ELEC001"],
    "fetchRequirement": "BILLS",
}
r = requests.post(url, headers=headers, json=payload)
print(r.json())`,

  go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]interface{}{
		"customerIdentifiers": []map[string]string{
			{"attributeName": "mobileNumber", "attributeValue": "9999999999"},
		},
		"agent": map[string]string{
			"app": "setuBillPay", "channel": "INT",
			"id": "agent-001", "type": "BUSINESS",
		},
		"billerIds":        []string{"MAHA0000ELEC001"},
		"fetchRequirement": "BILLS",
	})

	req, _ := http.NewRequest(
		"POST",
		"https://sandbox.setu.co/api/v2/bbps/bills/fetch/request",
		bytes.NewBuffer(payload),
	)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer eyJhbGci0iJSUzI1NiJ9...")

	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	fmt.Println(resp.Status)
}`,
};

/* =============================================================================
   Response examples
   ============================================================================= */

const RESPONSES: ResponseEntry[] = [
  {
    code: 200,
    text: 'OK',
    body: `{
    "status": 200,
    "success": true,
    "data": {
        "refId": "BBPS20240127001",
        "billerResponse": {
            "billDate": "2024-01-01",
            "billDueDate": "2024-01-31",
            "billNumber": "ELEC-2024-10001",
            "billPeriod": "01/01/2024 - 01/31/2024",
            "amount": {
                "amount": 85000,
                "currencyCode": "356"
            },
            "customerName": "Rahul Sharma",
            "additionalInfo": [
                {
                    "name": "Consumer Number",
                    "value": "1234567890"
                }
            ]
        }
    }
}`,
  },
  {
    code: 400,
    text: 'Bad Request',
    body: `{
    "status": 400,
    "success": false,
    "error": {
        "code": "INVALID_BILLER_ID",
        "message": "The biller ID provided is not valid or not active.",
        "traceId": "trace-abc-123"
    }
}`,
  },
  {
    code: 401,
    text: 'Unauthorized',
    body: `{
    "status": 401,
    "success": false,
    "error": {
        "code": "INVALID_TOKEN",
        "message": "Bearer token is missing, expired, or invalid."
    }
}`,
  },
  {
    code: 500,
    text: 'Internal Server Error',
    body: `{
    "status": 500,
    "success": false,
    "error": {
        "code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred. Please try again later.",
        "traceId": "trace-xyz-789"
    }
}`,
  },
];

/* =============================================================================
   Simulated async run
   ============================================================================= */
function simulateRun(_lang: string, _code: string): Promise<ResponseEntry[]> {
  return new Promise(resolve =>
    setTimeout(() => resolve(RESPONSES), 1400)
  );
}

/* =============================================================================
   Meta
   ============================================================================= */

const meta: Meta = {
  title: 'Components/CodeBlock',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Four composable components for API **tryout / code-snippet** panels.

| Component | Purpose |
|-----------|---------|
| \`CodeBlock\` | Base: syntax-highlighted code with line numbers |
| \`EndpointBlock\` | Request panel — language selector, copy, download, ▶ run |
| \`ResponseBlock\` | Response panel — status-code selector, copy, syntax highlight |
| \`TryoutPanel\` | Stacks Endpoint + Response, wires the run flow together |

**Syntax highlighting** is built-in (no external dependency):
- **JSON** — keys, strings, numbers, booleans, null
- **Shell / cURL** — \`--flags\`, quoted strings, URLs, keywords
- **Generic fallback** — string literals + comments for JS, Python, Java, Go, Ruby, PHP, C#, TypeScript

### When to use
- API reference docs — one \`TryoutPanel\` per endpoint.
- SDK docs — language-switchable code examples.
        `,
      },
    },
  },
};
export default meta;

/* =============================================================================
   Stories
   ============================================================================= */

/** Full tryout panel with live simulated run (1.4 s delay). */
export const Tryout: StoryObj = {
  name: 'TryoutPanel — live run simulation',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <TryoutPanel
        codeSamples={SAMPLES}
        defaultLanguage="shell"
        responses={RESPONSES}
        onRun={simulateRun}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Click ▶ to fire a simulated 1.4 s request. The response panel shows a spinner then renders the JSON result. Switch between all 6 languages in the selector.',
      },
    },
  },
};

/** TryoutPanel before any run — idle placeholder state. */
export const TryoutIdle: StoryObj = {
  name: 'TryoutPanel — idle (no response yet)',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <TryoutPanel
        codeSamples={SAMPLES}
        defaultLanguage="shell"
        onRun={simulateRun}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Initial state before the user clicks ▶. The response panel shows a neutral placeholder.',
      },
    },
  },
};

/** Just the EndpointBlock — useful for docs-only (no run needed). */
export const EndpointOnly: StoryObj = {
  name: 'EndpointBlock',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <EndpointBlock
        codeSamples={SAMPLES}
        defaultLanguage="javascript"
      />
    </div>
  ),
};

/** Just the ResponseBlock with all status-code variants. */
export const ResponseOnly: StoryObj = {
  name: 'ResponseBlock — all status codes',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <ResponseBlock responses={RESPONSES} defaultStatus={200} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the status-code dropdown in the header to switch between 200 OK, 400, 401, and 500 response examples.',
      },
    },
  },
};

/** Loading / spinner state. */
export const ResponseLoading: StoryObj = {
  name: 'ResponseBlock — loading',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <ResponseBlock responses={RESPONSES} isLoading />
    </div>
  ),
};

/** Base CodeBlock — reusable standalone renderer. */
export const JSONHighlight: StoryObj = {
  name: 'CodeBlock — JSON',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <CodeBlock language="json" code={RESPONSES[0].body} />
    </div>
  ),
};

export const ShellHighlight: StoryObj = {
  name: 'CodeBlock — Shell / cURL',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <CodeBlock language="shell" code={SAMPLES.shell} />
    </div>
  ),
};

export const PythonHighlight: StoryObj = {
  name: 'CodeBlock — Python',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <CodeBlock language="python" code={SAMPLES.python} />
    </div>
  ),
};

export const GoHighlight: StoryObj = {
  name: 'CodeBlock — Go',
  render: () => (
    <div style={{ maxWidth: 680 }}>
      <CodeBlock language="go" code={SAMPLES.go} />
    </div>
  ),
};
