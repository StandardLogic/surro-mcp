# Surro MCP

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP Compatible](https://img.shields.io/badge/MCP-compatible-green)](https://modelcontextprotocol.io)

MCP server for managing [Surro](https://surro.io) gates, catalogs, and passports via Claude Desktop, claude.ai, or any MCP client.

---

## TypeScript

[![npm version](https://img.shields.io/npm/v/surro-mcp)](https://www.npmjs.com/package/surro-mcp)

```bash
npx surro-mcp
```

Add to your MCP client config:

```json
{
  "mcpServers": {
    "surro": {
      "command": "npx",
      "args": ["surro-mcp"],
      "env": {
        "SURRO_API_KEY": "uni_live_xxxxxxxx"
      }
    }
  }
}
```

See [`typescript/README.md`](typescript/README.md) for full documentation.

---

## Python

[![PyPI version](https://img.shields.io/pypi/v/surro-mcp)](https://pypi.org/project/surro-mcp/)

```bash
pip install surro-mcp
```

```python
from surro import SurroClient

client = SurroClient(api_key="uni_live_xxxxxxxx")
gates = client.list_gates()
```

See [`python/README.md`](python/README.md) for full documentation.

---

## License

MIT — [Standard Logic Co.](https://standardlogic.ai)
