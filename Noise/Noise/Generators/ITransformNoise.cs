namespace Noise.Generators
{
	public interface ITransformNoise : IMakeNoise
	{
		float OutScale { get; }
	}
}