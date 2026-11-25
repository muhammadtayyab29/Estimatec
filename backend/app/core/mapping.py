MAP_TO_CAMEL = {
    "estimatorid": "estimatorId",
    "agentid": "agentId",
    "estvalue": "estValue",
    "createdat": "createdAt",
    "updatedat": "updatedAt",
    "projectid": "projectId",
    "totalvalue": "totalValue",
    "agentstatus": "agentStatus",
    "adminstatus": "adminStatus",
    "lastlogin": "lastLogin"
}

def to_db(data):
    if not data:
        return data
    if isinstance(data, list):
        return [to_db(item) for item in data]
    if isinstance(data, dict):
        return {k.lower(): to_db(v) for k, v in data.items()}
    return data

def to_frontend(data):
    if not data:
        return data
    if isinstance(data, list):
        return [to_frontend(item) for item in data]
    if isinstance(data, dict):
        out = {}
        for k, v in data.items():
            mapped_k = MAP_TO_CAMEL.get(k.lower(), k)
            out[mapped_k] = to_frontend(v)
        return out
    return data
