<template>
  <div class="content">
    <div class="row">
      <div class="card p-3">
        <h1>Nuevo Dispositivo</h1>

        <div class="row">
          <div class="col-4">
            <BaseInput
              label="Nombre"
              type="text"
              placeholder="Escriba un nombre"
            ></BaseInput>
          </div>
          <div class="col-4">
            <BaseInput
              label="Identificador"
              type="text"
              placeholder="Escriba un id"
            ></BaseInput>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <BaseButton type="primary" @click="addDevice()">Agregar</BaseButton>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card p-3">
        <h1>Dispositivos Registrados</h1>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Identificador</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody v-for="device in devices" :key="device">
            <tr>
              <td>{{ device.name }}</td>
              <td>{{ device.id }}</td>
              <td>
                <BaseButton
                  type="danger"
                  icon
                  size="sm"
                  class="btn-link"
                  @click="deleteDevice(device.id)"
                >
                  <i class="tim-icons icon-simple-remove"></i>
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newDevice: {
        name: '',
        id: ''
      },
      devices: [
        {
          name: "oficina",
          id: "123",
        },
        {
          name: "cuarto",
          id: "333",
        },
        {
          name: "garage",
          id: "656",
        },
      ],
    };
  },
  methods: {
    addDevice() {
      console.log(this.newDevice.name)
    },
    deleteDevice(id) {
      const newArray = this.devices.filter((device) => device.id !== id);
      this.devices = newArray;
    },
  },
};
</script>

<style>
table,
td,
th {
  padding: 0.5rem;
}

td {
  border-top: 1px solid purple;
  border-bottom: 1px solid purple;
}
</style>
