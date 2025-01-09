      //esta variable define como va a caer de rapido el jugador
      var gravedad = 1;
      var salto = -8;

      var desfase_global_x = 0;
      // Aquí instancio una única copia del jugador humano
      var jugador = new Jugador();
      // Aquí instancio a los npc en un array de 50 elementos
      var misnpcs = [];
      var balas = [];
      var numeronpc = 5;
      for(let i = 0;i<numeronpc;i++){
        //para cada elemento metemos una instancia de npc
        misnpcs[i] = new Npc();
      }