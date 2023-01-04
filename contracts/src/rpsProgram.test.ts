/* eslint-disable */
import { Field, Poseidon, Proof, isReady, shutdown } from 'snarkyjs';
import { tic, toc } from './tictoc.js';
import { rpsProgram, rpsState } from './rpsProgram.js';

describe('Rock Paper Scissors', () => {
  let p1Secret: Field,
    p1Move: Field,
    p1MoveHashed: Field,
    p1State: rpsState,
    p2Move: Field,
    p2State: rpsState,
    confirmState: rpsState,
    proofP1Moved: Proof<rpsState>,
    proofP2Moved: Proof<rpsState>,
    proofWinner: Proof<rpsState>;

  beforeAll(async () => {
    await isReady;
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  it('compiles and can start generating proofs', async () => {
    await rpsProgram.compile();
  });

  it('proves p1 made a valid move', async () => {
    p1Move = Field(1);

    p1Secret = Field(24);
    p1MoveHashed = Poseidon.hash([p1Move, p1Secret]);
    p1State = {
      player1Choice: p1MoveHashed,
      player2Choice: Field(-1),
      result: Field(-1),
    };

    proofP1Moved = await rpsProgram.p1Move(p1State, p1Move, p1Secret);
  });

  it('proves p2 made a valid move', async () => {
    p2Move = Field(2);

    p2State = {
      player1Choice: proofP1Moved.publicInput.player1Choice,
      player2Choice: p2Move,
      result: proofP1Moved.publicInput.result,
    };

    proofP2Moved = await rpsProgram.p2Move(p2State, p2Move, proofP1Moved);
  });

  it('proves result is checked and winner state is updated correctly', async () => {
    let result = Field(2);

    confirmState = {
      player1Choice: proofP2Moved.publicInput.player1Choice,
      player2Choice: proofP2Moved.publicInput.player2Choice,
      result: result,
    };

    proofWinner = await rpsProgram.checkWinner(
      confirmState,
      p1Move,
      p2Move,
      p1Secret,
      proofP2Moved
    );
  });
});
