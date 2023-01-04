/* eslint-disable */
import {
  Experimental,
  Field,
  Poseidon,
  SelfProof,
  Struct,
  UInt32,
} from 'snarkyjs';

export class rpsState extends Struct({
  player1Choice: Field, // secret fields
  player2Choice: Field, // secret fields
  result: UInt32,
  player1Score: UInt32,
  player2Score: UInt32,
  bestOf: UInt32,
}) {}

export const rpsProgram = Experimental.ZkProgram({
  publicInput: rpsState,

  methods: {
    initGame: {
      privateInputs: [],
      method(publicInput: rpsState) {
        publicInput.player1Choice.assertEquals(Field(0));
        publicInput.player2Choice.assertEquals(Field(0));

        publicInput.result.assertEquals(UInt32.from(10));
        publicInput.player1Score.assertEquals(UInt32.from(0));
        publicInput.player2Score.assertEquals(UInt32.from(0));
        publicInput.bestOf.assertEquals(UInt32.from(3));
      },
    },

    p1Move: {
      privateInputs: [Field, Field, SelfProof],
      method(
        publicInput: rpsState,
        move: Field,
        secret: Field,
        prevProof: SelfProof<rpsState>
      ) {
        prevProof.verify();
        move.assertGte(Field(0));
        move.assertLte(Field(2));
        publicInput.player2Choice.assertEquals(
          prevProof.publicInput.player2Choice
        );

        // p1 makes a valid move
        publicInput.player1Choice.assertEquals(Poseidon.hash([move, secret]));
      },
    },

    p2Move: {
      privateInputs: [Field, Field, SelfProof],
      method(
        publicInput: rpsState,
        move: Field,
        secret: Field,
        prevProof: SelfProof<rpsState>
      ) {
        prevProof.verify();
        move.assertGte(Field(0));
        move.assertLte(Field(2));
        publicInput.player1Choice.assertEquals(
          prevProof.publicInput.player1Choice
        );

        // p2 makes a valid move
        publicInput.player2Choice.assertEquals(Poseidon.hash([move, secret]));
      },
    },
  },
});
