// DEPRECATED IN FAVOR OF JEST TESTS AND LAB1.TS

/* eslint-disable */
// import { Field, Poseidon, isReady, shutdown } from 'snarkyjs';
// import { tic, toc } from './tictoc.js';
// import { rpsProgram } from './rpsProgram.js';
// import { rpsState } from './rpsHelpers.js';

// async function main() {
//   tic('SnarkyJs Loading');
//   await isReady;
//   toc();

//   // Compile
//   tic('Compiling');
//   await rpsProgram.compile();
//   toc();

//   // --------------------------------------
//   // Test case: p1 always chooses rock (1):
//   // p2 chooses paper (2)

//   // 1. p1 chooses rock:

//   // private inputs
//   const myP1Secret = Field(24);
//   const myP1Move = Field(1);
//   const p1choice = Poseidon.hash([myP1Move, myP1Secret]); // rock with a secret of 24

//   // public state
//   let p1State = new rpsState({
//     player1Choice: p1choice,
//     player2Choice: Field(-1),
//     result: Field(100),
//   });

//   // proof
//   tic('PROOF 1: p1 chooses rock');
//   const proof1 = await rpsProgram.p1Move(p1State, myP1Move, myP1Secret);
//   toc();

//   // 2. p2 chooses paper:

//   // private inputs
//   const myP2Move = Field(2);
//   const p2choice = myP2Move;

//   // public state
//   let p2State = new rpsState({
//     player1Choice: proof1.publicInput.player1Choice,
//     player2Choice: p2choice,
//     result: Field(-1),
//   });

//   // proof
//   tic('PROOF 2: p2 chooses paper');
//   const proof2 = await rpsProgram.p2Move(p2State, myP2Move, proof1);
//   toc();

//   // 3. p1 checks winner:

//   // private inputs
//   const confirmP1 = myP1Move;
//   const confirmP2 = proof2.publicInput.player2Choice;
//   const secret = myP1Secret;

//   // public state
//   let confirmState = new rpsState({
//     player1Choice: proof2.publicInput.player1Choice,
//     player2Choice: proof2.publicInput.player2Choice,
//     result: Field(2),
//   });

//   // proof
//   tic('PROOF 3: p2 chooses paper');
//   const proof3 = await rpsProgram.checkWinner(
//     confirmState,
//     confirmP1,
//     confirmP2,
//     secret,
//     proof2
//   );
//   toc();

//   await shutdown();
// }

// main()
//   .catch(console.error)
//   .then(() => {
//     console.log('Caught some error: compile or proof Failed');
//     shutdown();
//   });
