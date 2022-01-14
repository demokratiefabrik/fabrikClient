
    // applyCssVarProfileColor(): Record<string, unknown> {
    //   // This code apply writes the profile color into the css variable profilecolor.
    //   // the variable is used for the css classes: .bg-profilecolor and .profilecolor
    //   return {
    //     '--profilecolor': this.profileColor,
    //     '--profilecolor-light': this.lightProfileColor,
    //   };
    // },

    // TODO: disabled due to vue 3 migration
    // https://medium.com/@codetheorist/using-vuejs-computed-properties-for-dynamic-module-imports-2046743afcaf
    // AssemblyMenuComponentLoader() {
    //   if (this.showAssemblyMenu) {
    //     // TODO: disabled. due to error
    //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    //     // return () => import(`../plugins/${this.assemblyType}/Menu.vue`);
    //   }
    //   return () => null;
    // },
    // is_assembly_page: function () {
    //   return (
    //     this.$route.name === 'assemblies' ||
    //     !!this.$route.params.assemblyIdentifier
    //   );
    // },
    
  // mounted() {

  // if (this.is_assembly_page) {
  // loadComponent();
  // }

  // enable or disable AssemblyMenu
  // TODO: DW:
  // this.showAssemblyMenu = false;
  // const current = this.$router.currentRoute as any
  // this.showAssemblyMenu = this.assemblyType &&
  //   !current?.meta?.hideAssemblyMenu &&
  //   !this.IsManager;
  // }


  
//   <!-- MAIN MENU -->
//   <!-- TODO <div v-if="showAssemblyMenu">
//     <component
//       :is="AssemblyMenuComponentLoader"
//       :menuOffset="menuOffset"
//       v-if="is_assembly_page"
//     />
//   </div> -->
//   <!-- END DYNAMIC MENU -->