import { InteractionMode } from '../../types/domain.types';

export function generateMockAIResponse(
  topicTitle: string,
  mode: InteractionMode,
  question: string
): string {
  const cleanQuestion = question.trim();

  switch (mode) {
    case InteractionMode.LEARN:
      return (
        `[Cognibloom AI - Learning Guide]\n\n` +
        `**Topic:** ${topicTitle}\n` +
        `**Concept Exploration:** "${cleanQuestion}"\n\n` +
        `### Key Principles\n` +
        `1. **Core Mechanism:** When working with ${topicTitle}, understanding the underlying state flow and abstractions is critical for building resilient systems.\n` +
        `2. **Best Practices:** Focus on modular decomposition, predictable data contracts, and proactive edge-case handling.\n` +
        `3. **Practical Application:** Break the problem down into verifiable steps and inspect behavior at each stage.\n\n` +
        `### Deep Dive\n` +
        `Regarding your inquiry on "${cleanQuestion}", the standard approach involves structuring your solution with clear boundaries, maintaining declarative configurations, and optimizing performance bottlenecks.\n\n` +
        `*Next recommended step: Would you like a challenge or a deeper code explanation on this sub-topic?*`
      );

    case InteractionMode.CHALLENGE:
      return (
        `[Cognibloom AI - Knowledge Challenge]\n\n` +
        `**Topic:** ${topicTitle}\n` +
        `**Challenge Scenario:** "${cleanQuestion}"\n\n` +
        `### The Challenge\n` +
        `Suppose a production workload on ${topicTitle} experiences unexpected throughput degradation under high concurrency.\n\n` +
        `**Question:** How would you identify whether the bottleneck stems from connection saturation, serialization overhead, or unindexed queries?\n\n` +
        `### Constraints & Considerations:\n` +
        `- Time complexity must remain sub-linear.\n` +
        `- Zero downtime deployment is required.\n` +
        `- State your hypothesis and describe your step-by-step diagnostic plan!`
      );

    case InteractionMode.EXPLAIN:
      return (
        `[Cognibloom AI - Conceptual Breakdown]\n\n` +
        `**Topic:** ${topicTitle}\n` +
        `**In-Depth Explanation for:** "${cleanQuestion}"\n\n` +
        `### Mental Model\n` +
        `Think of ${topicTitle} as a coordinated pipeline: inputs are validated, processed according to deterministic rules, and propagated to downstream components.\n\n` +
        `### Step-by-Step Walkthrough:\n` +
        `1. **Initialization:** The context and runtime environment are configured.\n` +
        `2. **Execution:** Operations execute within strict transactional boundaries to preserve invariants.\n` +
        `3. **Settlement:** Errors are caught and handled gracefully while successful results are returned cleanly.\n\n` +
        `*Summary:* "${cleanQuestion}" directly influences how components interact and maintain consistency.`
      );

    case InteractionMode.VALIDATE:
      return (
        `[Cognibloom AI - Solution Validation]\n\n` +
        `**Topic:** ${topicTitle}\n` +
        `**Evaluation of:** "${cleanQuestion}"\n\n` +
        `### Assessment\n` +
        `✅ **Correctness:** Your formulation aligns well with established best practices in ${topicTitle}.\n` +
        `💡 **Optimization Suggestion:** Consider handling boundary conditions (such as empty inputs or race conditions) to improve robustness.\n` +
        `🔒 **Security & Quality:** Ensure inputs are strictly sanitized and authorization checks are enforced before executing core business logic.\n\n` +
        `Overall rating: Solid foundation and technically sound!`
      );

    default:
      return `[Cognibloom AI] Processed your question on "${topicTitle}": "${cleanQuestion}".`;
  }
}
