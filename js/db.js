//Dexie.delete('WorkersDB'); 

const db = new Dexie("WorkersDB");

db.version(1).stores({
  workers: "++id,first_name,last_name,date_of_birth,phone,email,last_updated",
  employers: "++id,name,phone,email,address,last_updated",
  contracts: "++id,worker_id,employer_id,start_date,end_date,hours_per_week,hourly_wage,last_updated",
  work_sessions: "++id,contract_id,date,hours_worked,notes,last_updated",
  payments: "++id,contract_id,date,amount,method,last_updated",
  logs: "++id,timestamp,type,message",
  kv: '&key',
  forms: '&id, updatedAt'
});


/* ===================================
 *  KEY/VALUE STORE
 * =================================== */
const KV = {
  async set(key, value) {
    try {
      await db.kv.put({ key, value });
    } catch (err) {
      console.error('KV.set error:', err);
    }
  },

  async get(key, defaultValue = null) {
    try {
      const item = await db.kv.get(key);
      return item?.value ?? defaultValue;
    } catch (err) {
      console.error('KV.get error:', err);
      return defaultValue;
    }
  },

  async delete(key) {
    try {
      await db.kv.delete(key);
    } catch (err) {
      console.error('KV.delete error:', err);
    }
  },

  async clear() {
    try {
      await db.kv.clear();
    } catch (err) {
      console.error('KV.clear error:', err);
    }
  },
  async is(key, expectedValue) {
    try {
      const item = await db.kv.get(key);
      return item?.value === expectedValue;
    } catch (err) {
      console.error('KV.is error:', err);
      return false;
    }
  }
};

/* ===================================
 *  FORM STATE STORE
 * =================================== */
const FormStore = {
  async save(formId) {
    try {
      const $form = $(`#${formId}`);
      if (!$form.length) return;

      const data = {};

      $form.find(':input[name]').each(function () {
        const $el = $(this);
        const name = $el.attr('name');
        const type = $el.attr('type');

        if (type === 'checkbox') {
          data[name] = $el.is(':checked');
        } else if (type === 'radio') {
          if ($el.is(':checked')) data[name] = $el.val();
        } else {
          data[name] = $el.val();
        }
      });

      await db.forms.put({
        id: formId,
        state: data,
        updatedAt: Date.now()
      });
    } catch (err) {
      console.error('FormStore.save error:', err);
    }
  },

  async load(formId) {
    try {
      const record = await db.forms.get(formId);
      if (!record?.state) return null;

      const $form = $(`#${formId}`);
      const data = record.state;

      for (const [name, value] of Object.entries(data)) {
        const $el = $form.find(`[name="${name}"]`);
        if (!$el.length) continue;

        const type = $el.attr('type');
        if (type === 'checkbox') {
          $el.prop('checked', !!value);
        } else if (type === 'radio') {
          $form.find(`[name="${name}"][value="${value}"]`).prop('checked', true);
        } else {
          $el.val(value);
        }
      }

      return data;
    } catch (err) {
      console.error('FormStore.load error:', err);
      return null;
    }
  },

  async delete(formId) {
    try {
      await db.forms.delete(formId);
    } catch (err) {
      console.error('FormStore.delete error:', err);
    }
  },

  async list() {
    try {
      return await db.forms.toArray();
    } catch (err) {
      console.error('FormStore.list error:', err);
      return [];
    }
  },

  async clear() {
    try {
      await db.forms.clear();
    } catch (err) {
      console.error('FormStore.clear error:', err);
    }
  }
};

/* ===================================
 *  EXPORT GLOBALE
 * =================================== */
window.AppDB = { KV, FormStore };

