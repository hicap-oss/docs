# Workflow operation routing verification

Checked October 26, 2026 against the current production API Management API serving https://api.hicap.ai/v1, matched to its custom hostname.

## Result

All 35 Assistants/Threads/Vector Store operations previously given blanket legacy notes are registered in production. All 35 public requests reached authentication and returned 401 for a deliberately invalid key when their required route query parameters were included.

32 operation templates include ?api-version={api-version}. Without this parameter, those 32 returned 404. The remaining three (create assistant, create thread, create vector-store file batch) match without a version in the gateway template. Their existing schema still requires api-version; this check does not relax a possible backend requirement.

The initial no-version probes did not establish endpoint absence. The blanket legacy notes, hidden flags and corresponding schema descriptions have been removed. These operations are now included in navigation, and the API overview explains the versioned route requirement.

## Evidence and reproduction

- Read the current production API list and operations using Azure management APIs; no deployment or policy changes.
- Normalize parameter names and compare every documented method/path with a deployed method/urlTemplate.
- Probe each public method/path using a deliberately invalid api-key and nonexistent resource IDs, adding the api-version example from the schema when the deployed route requires it.
- Inspect the status and known authentication error, without invoking model inference or changing resources.
- Structured results: the adjacent operation-routing-2026-10-26.json file.

## Limits

This verifies production registration and public route recognition. It does not verify successful authenticated CRUD, valid-resource reads, provider execution, supported backend API versions, permissions for every connection, or complete workflow behavior. No assistants, threads, runs, vector stores or file batches were created, modified, run or deleted. No inference costs were incurred. HTTP 401 is evidence of reaching the auth gate, not proof of successful backend execution.

## Operations

| Method | Path | Gateway requires api-version | Auth-gate status |
| --- | --- | --- | --- |
| `POST` | `/threads/{threadId}/runs/{runId}/cancel` | Yes | 401 |
| `POST` | `/threads/{threadId}/messages` | Yes | 401 |
| `POST` | `/threads/{threadId}/runs` | Yes | 401 |
| `POST` | `/threads/runs` | Yes | 401 |
| `POST` | `/threads` | Not in route template | 401 |
| `POST` | `/assistants` | Not in route template | 401 |
| `DELETE` | `/threads/{threadId}` | Yes | 401 |
| `DELETE` | `/assistants/{assistantId}` | Yes | 401 |
| `POST` | `/threads/{threadId}/messages/{messageId}` | Yes | 401 |
| `POST` | `/threads/{threadId}/runs/{runId}` | Yes | 401 |
| `POST` | `/threads/{threadId}` | Yes | 401 |
| `POST` | `/assistants/{assistantId}` | Yes | 401 |
| `GET` | `/threads/{threadId}/messages/{messageId}` | Yes | 401 |
| `GET` | `/threads/{threadId}/runs/{runId}/steps/{stepId}` | Yes | 401 |
| `GET` | `/threads/{threadId}/runs/{runId}` | Yes | 401 |
| `GET` | `/threads/{threadId}` | Yes | 401 |
| `GET` | `/assistants/{assistantId}` | Yes | 401 |
| `GET` | `/assistants` | Yes | 401 |
| `GET` | `/threads/{threadId}/messages` | Yes | 401 |
| `GET` | `/threads/{threadId}/runs/{runId}/steps` | Yes | 401 |
| `GET` | `/threads/{threadId}/runs` | Yes | 401 |
| `POST` | `/threads/{threadId}/runs/{runId}/submit_tool_outputs` | Yes | 401 |
| `POST` | `/vector_stores/{vectorStoreId}/file_batches/{batchId}/cancel` | Yes | 401 |
| `POST` | `/vector_stores/{vectorStoreId}/file_batches` | Not in route template | 401 |
| `POST` | `/vector_stores/{vectorStoreId}/files` | Yes | 401 |
| `POST` | `/vector_stores` | Yes | 401 |
| `DELETE` | `/vector_stores/{vectorStoreId}/files/{fileId}` | Yes | 401 |
| `DELETE` | `/vector_stores/{vectorStoreId}` | Yes | 401 |
| `POST` | `/vector_stores/{vectorStoreId}` | Yes | 401 |
| `GET` | `/vector_stores/{vectorStoreId}/file_batches/{batchId}` | Yes | 401 |
| `GET` | `/vector_stores/{vectorStoreId}/files/{fileId}` | Yes | 401 |
| `GET` | `/vector_stores/{vectorStoreId}` | Yes | 401 |
| `GET` | `/vector_stores/{vectorStoreId}/file_batches/{batchId}/files` | Yes | 401 |
| `GET` | `/vector_stores/{vectorStoreId}/files` | Yes | 401 |
| `GET` | `/vector_stores` | Yes | 401 |
