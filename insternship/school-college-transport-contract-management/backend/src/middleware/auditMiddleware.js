const auditLogModel = require("../models/auditLogModel");

async function recordAudit({ req, entityType, entityId, action, oldValue = null, newValue = null }) {
  if (!req.user) {
    return;
  }

  await auditLogModel.create({
    user_id: req.user.id,
    entity_type: entityType,
    entity_id: entityId,
    action,
    old_value: oldValue,
    new_value: newValue
  });
}

module.exports = { recordAudit };

