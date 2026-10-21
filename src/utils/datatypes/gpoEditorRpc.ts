// COPIED from freeipa-server-gpo (frontend/types/rpc.d.ts, generated there from tests/contracts/gpo_editor/*.json).
// Do not edit here: regenerate it in that repository and copy it again when the plugin's API_VERSION changes.
// The types of the `gpo_editor_*` answers (the `result` of the JSON-RPC answer).

/** The part of every answer that describes the policy and the state of its publication. */
export interface EditorEnvelope {
  gpo: {
    displayname: string;
    guid: string;
    distinguished_name: string;
  };
  snapshot: {
    identity: {
      guid: string;
      distinguished_name: string;
    };
    version_number: number;
    machine_extension_names: string;
    user_extension_names: string;
  };
  template: unknown;
  security_catalog_status: unknown;
  locales: string[];
  diagnostics: unknown[];
  pending_publication: unknown;
}

/** Answer of `gpo_editor_advanced_audit_show`. */
export type GpoEditorAdvancedAuditShowResult = EditorEnvelope & {
  advanced_audit: {
    rows: unknown[];
    subcategory_catalog: {
      guid: string;
      display_name: string;
    }[];
  };
};

/** Answer of `gpo_editor_advanced_audit_update`. */
export type GpoEditorAdvancedAuditUpdateResult = EditorEnvelope & {
  advanced_audit: {
    rows: unknown[];
    subcategory_catalog: {
      guid: string;
      display_name: string;
    }[];
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_children`. */
export type GpoEditorChildrenResult = EditorEnvelope & {
  children: {
    kind: string;
    id: string;
    label: string;
  }[];
};

/** Answer of `gpo_editor_open`. */
export type GpoEditorOpenResult = EditorEnvelope & {
  preference_documents: {
    scope: string;
    kind: string;
    label: string;
    editable: boolean;
    display_order: number;
    category_id: string;
    category_label: unknown;
    category_order: number;
  }[];
};

/** Answer of `gpo_editor_policy_index`. */
export type GpoEditorPolicyIndexResult = EditorEnvelope & {
  policies: {
    id: string;
    label: string;
    path: string[];
  }[];
};

/** Answer of `gpo_editor_policy_show`. */
export type GpoEditorPolicyShowResult = EditorEnvelope & {
  policy: {
    scope: string;
    policy_id: string;
    state: string;
    comment: unknown;
    capabilities: {
      enable: boolean;
      disable: boolean;
      clear: boolean;
      inspect_parameters: boolean;
      edit_parameters: boolean;
      edit_comments: boolean;
    };
    state_actions: {
      enabled: {
        available: boolean;
        mode: string;
        requires_parameters: boolean;
      };
      disabled: {
        available: boolean;
        mode: string;
        requires_parameters: boolean;
      };
      not_configured: {
        available: boolean;
        mode: string;
        requires_parameters: boolean;
      };
    };
    supported_on: string;
    explain_text: string;
    label: string;
    parameters: {
      id: string;
      label: string;
      kind: string;
      editable: boolean;
      collection: unknown;
      value: unknown;
      default_value: unknown;
      choices: unknown[];
    }[];
    representability: unknown;
    unknown_raw_values: boolean;
  };
};

/** Answer of `gpo_editor_policy_update`. */
export type GpoEditorPolicyUpdateResult = EditorEnvelope & {
  policy: {
    scope: string;
    policy_id: string;
    state: string;
    comment: unknown;
    capabilities: {
      enable: boolean;
      disable: boolean;
      clear: boolean;
      inspect_parameters: boolean;
      edit_parameters: boolean;
      edit_comments: boolean;
    };
    state_actions: {
      enabled: {
        available: boolean;
        mode: string;
        requires_parameters: boolean;
      };
      disabled: {
        available: boolean;
        mode: string;
        requires_parameters: boolean;
      };
      not_configured: {
        available: boolean;
        mode: string;
        requires_parameters: boolean;
      };
    };
    supported_on: string;
    explain_text: string;
    label: string;
    parameters: {
      id: string;
      label: string;
      kind: string;
      editable: boolean;
      collection: unknown;
      value: unknown;
      default_value: unknown;
      choices: unknown[];
    }[];
    representability: unknown;
    unknown_raw_values: boolean;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_preference_create`. */
export type GpoEditorPreferenceCreateResult = EditorEnvelope & {
  item: {
    identity: string[];
    label: string;
    has_filters: boolean;
  };
  fields: {
    id: string;
    label: string;
    value: unknown;
    editable: boolean;
    required: boolean;
  }[];
  filters: {
    path: number[];
    kind: string;
    label: string;
    supports_children: boolean;
    child_count: number;
  }[];
  filter_fields: {
    path: number[];
    fields: {
      id: string;
      label: string;
      value: unknown;
      editable: boolean;
      required: boolean;
    }[];
    available: boolean;
  }[];
  filter_kinds: {
    kind: string;
    label: string;
    fields: {
      id: string;
      label: string;
      value: unknown;
      editable: boolean;
      required: boolean;
    }[];
    supports_children: boolean;
  }[];
  new_item_fields: {
    id: string;
    label: string;
    value: unknown;
    editable: boolean;
    required: boolean;
  }[];
  parent_candidates: {
    identity: unknown;
    label: string;
    parent_identity: unknown;
    depth: number;
  }[];
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_preference_delete`. */
export type GpoEditorPreferenceDeleteResult = EditorEnvelope & {
  deleted_identity: string[];
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_preference_documents`. */
export type GpoEditorPreferenceDocumentsResult = EditorEnvelope & {
  documents: {
    scope: string;
    kind: string;
    label: string;
    editable: boolean;
    display_order: number;
    category_id: string;
    category_label: unknown;
    category_order: number;
  }[];
};

/** Answer of `gpo_editor_preference_items`. */
export type GpoEditorPreferenceItemsResult = EditorEnvelope & {
  items: {
    identity: string[];
    label: string;
    has_filters: boolean;
  }[];
};

/** Answer of `gpo_editor_preference_show`. */
export type GpoEditorPreferenceShowResult = EditorEnvelope & {
  item: unknown;
  fields: {
    id: string;
    label: string;
    value: unknown;
    editable: boolean;
    required: boolean;
  }[];
  filters: unknown[];
  filter_fields: unknown[];
  filter_kinds: {
    kind: string;
    label: string;
    fields: {
      id: string;
      label: string;
      value: unknown;
      editable: boolean;
      required: boolean;
    }[];
    supports_children: boolean;
  }[];
  new_item_fields: {
    id: string;
    label: string;
    value: unknown;
    editable: boolean;
    required: boolean;
  }[];
  parent_candidates: {
    identity: unknown;
    label: string;
    parent_identity: unknown;
    depth: number;
  }[];
};

/** Answer of `gpo_editor_preference_update`. */
export type GpoEditorPreferenceUpdateResult = EditorEnvelope & {
  item: {
    identity: string[];
    label: string;
    has_filters: boolean;
  };
  fields: {
    id: string;
    label: string;
    value: unknown;
    editable: boolean;
    required: boolean;
  }[];
  filters: {
    path: number[];
    kind: string;
    label: string;
    supports_children: boolean;
    child_count: number;
  }[];
  filter_fields: {
    path: number[];
    fields: {
      id: string;
      label: string;
      value: unknown;
      editable: boolean;
      required: boolean;
    }[];
    available: boolean;
  }[];
  filter_kinds: {
    kind: string;
    label: string;
    fields: {
      id: string;
      label: string;
      value: unknown;
      editable: boolean;
      required: boolean;
    }[];
    supports_children: boolean;
  }[];
  new_item_fields: {
    id: string;
    label: string;
    value: unknown;
    editable: boolean;
    required: boolean;
  }[];
  parent_candidates: {
    identity: unknown;
    label: string;
    parent_identity: unknown;
    depth: number;
  }[];
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_reconcile`. */
export type GpoEditorReconcileResult = EditorEnvelope & {
  recovery: {
    kind: string;
    plan: unknown;
    conflict: unknown;
  };
};

/** Answer of `gpo_editor_script_asset_delete`. */
export type GpoEditorScriptAssetDeleteResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: unknown[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_asset_download`. */
export type GpoEditorScriptAssetDownloadResult = EditorEnvelope & {
  asset: {
    name: string;
    byte_size: number;
    revision: string;
    content_base64: string;
  };
};

/** Answer of `gpo_editor_script_asset_replace`. */
export type GpoEditorScriptAssetReplaceResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_asset_upload`. */
export type GpoEditorScriptAssetUploadResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_entries_reorder`. */
export type GpoEditorScriptEntriesReorderResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_entry_add`. */
export type GpoEditorScriptEntryAddResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_entry_remove`. */
export type GpoEditorScriptEntryRemoveResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: unknown[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: unknown[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_entry_update`. */
export type GpoEditorScriptEntryUpdateResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_files`. */
export type GpoEditorScriptFilesResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
};

/** Answer of `gpo_editor_script_order_update`. */
export type GpoEditorScriptOrderUpdateResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_script_upload_and_add`. */
export type GpoEditorScriptUploadAndAddResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
  publication: {
    changed: boolean;
  };
};

/** Answer of `gpo_editor_scripts_show`. */
export type GpoEditorScriptsShowResult = EditorEnvelope & {
  scripts: {
    scope: string;
    event: string;
    classic: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: {
        message: string;
        code: string;
      }[];
    };
    powershell: {
      snapshot: unknown;
      editable: boolean;
      entries: {
        identity: string;
        command_line: string;
        parameters: string;
        managed_asset_name: unknown;
        kind: string;
      }[];
      diagnostics: unknown[];
    };
    execution_order: string;
    assets: {
      name: string;
      byte_size: number;
      revision: string;
      references: {
        event: string;
        executable_group: string;
        index: number;
      }[];
    }[];
    upload_limit_bytes: number;
  };
};

/** Answer of `gpo_editor_security_definitions_show`. */
export type GpoEditorSecurityDefinitionsShowResult = EditorEnvelope & {
  security_catalog: {
    semantic_revision: string;
    categories: {
      namespace: string;
      id: string;
      display_name: string;
    }[];
    policies: {
      namespace: string;
      policy_id: string;
      display_name: string;
      category: string[];
      elements: {
        id: string;
        value_type: string;
      }[];
    }[];
  };
  security_snapshot: {
    policies: unknown[];
    diagnostics: unknown[];
  };
  security_service_catalog: unknown[];
};

/** Answer of `gpo_editor_security_definitions_update`. */
export type GpoEditorSecurityDefinitionsUpdateResult = EditorEnvelope & {
  security_catalog: {
    semantic_revision: string;
    categories: {
      namespace: string;
      id: string;
      display_name: string;
    }[];
    policies: {
      namespace: string;
      policy_id: string;
      display_name: string;
      category: string[];
      elements: {
        id: string;
        value_type: string;
      }[];
    }[];
  };
  security_snapshot: {
    policies: {
      namespace: string;
      policy_id: string;
      state: string;
      elements: {
        value: {
          state: string;
          value: {
            kind: string;
            value: number;
          };
        };
      };
    }[];
    diagnostics: unknown[];
  };
  security_service_catalog: unknown[];
  publication: {
    changed: boolean;
  };
};
