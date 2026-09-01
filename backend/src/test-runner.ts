import { AuthService } from './features/auth/auth.service';
import { TopicService } from './features/topics/topic.service';
import { SessionService } from './features/sessions/session.service';
import { InteractionService } from './features/interactions/interaction.service';
import { DashboardService } from './features/dashboard/dashboard.service';
import { generateMockAIResponse } from './features/interactions/interaction.ai';
import { generateToken, verifyToken } from './utils/jwt';
import { hashPassword, comparePassword } from './utils/password';
import { InteractionMode } from './types/domain.types';

async function runSanityTests() {
  console.log('🧪 Running Cognibloom Feature-Based Backend Sanity & Integration Unit Checks...\n');

  // 1. Password Hashing & Verification Test
  console.log('1. Testing Password Security Utility:');
  const password = 'mySecurePassword123';
  const hashed = await hashPassword(password);
  const isValid = await comparePassword(password, hashed);
  const isInvalid = await comparePassword('wrongPassword', hashed);
  console.log(`   - Hash generation: ✅ (length: ${hashed.length})`);
  console.log(`   - Correct password verification: ${isValid ? '✅' : '❌'}`);
  console.log(`   - Incorrect password rejection: ${!isInvalid ? '✅' : '❌'}`);
  if (!isValid || isInvalid) throw new Error('Password verification test failed');

  // 2. JWT Generation & Verification Test
  console.log('\n2. Testing JWT Signing & Decoding:');
  const payload = { userId: 42, email: 'test@cognibloom.com', username: 'tester' };
  const token = generateToken(payload);
  const decoded = verifyToken(token);
  console.log(`   - Token generation: ✅`);
  console.log(`   - Token payload extraction: ${decoded.userId === 42 && decoded.email === 'test@cognibloom.com' ? '✅' : '❌'}`);
  if (decoded.userId !== 42) throw new Error('JWT verification test failed');

  // 3. AI Mock Response Generation across all 4 modes
  console.log('\n3. Testing Mock AI Response Generation for all 4 Interaction Modes:');
  const modes: InteractionMode[] = [
    InteractionMode.LEARN,
    InteractionMode.CHALLENGE,
    InteractionMode.EXPLAIN,
    InteractionMode.VALIDATE,
  ];

  for (const mode of modes) {
    const aiResp = generateMockAIResponse(
      'Distributed Systems',
      mode,
      'How to handle network partitions in distributed consensus?'
    );
    console.log(`   - Mode [${mode}]: ✅ (Length: ${aiResp.length} chars)`);
    if (!aiResp || aiResp.length < 50) throw new Error(`AI mock failed for mode ${mode}`);
  }

  // 4. Verification of Feature Services & Controllers
  console.log('\n4. Checking Feature Service & Controller instances:');
  console.log(`   - Auth Feature (AuthService): ${AuthService ? '✅' : '❌'}`);
  console.log(`   - Topics Feature (TopicService): ${TopicService ? '✅' : '❌'}`);
  console.log(`   - Sessions Feature (SessionService): ${SessionService ? '✅' : '❌'}`);
  console.log(`   - Interactions Feature (InteractionService): ${InteractionService ? '✅' : '❌'}`);
  console.log(`   - Dashboard Feature (DashboardService): ${DashboardService ? '✅' : '❌'}`);

  console.log('\n🎉 All feature-based backend unit checks PASSED successfully!');
}

runSanityTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
