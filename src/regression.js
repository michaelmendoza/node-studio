
class Regression {
	constructor() {

	}

	linearLeastSquares(x, y) {
		var beta1, beta2;
		var xBar = 0;
		var yBar = 0;
		var temp1 = 0;
		var temp2 = 0;
		var count = x.length;

		// Calculate mean: x-bar and y-bar
		for (var i = 0; i < count; i++) {
			xBar = xBar + x[i];
			yBar = yBar + y[i];
		}
		xBar = xBar / count;
		yBar = yBar / count;

		// Calculate beta2
		for (var i = 0; i < count; i++) {
			temp1 = temp1 + (x[i] - xBar) * (y[i] - yBar);
			temp2 = temp2 + (x[i] - xBar) * (x[i] - xBar);
		}
		beta2 = temp1 / temp2;

		// Calculate beta1
		beta1 = yBar - beta2 * xBar;

		// Return coefficents of regression
		return [beta1, beta2];
	}

	nonlinearLeastSquares() {

	}
	
	levenbergMarquardtRegression(x, y) {
		/*

		// Set Matrix and Vector Varibles
		Matrix J, JtJ;
		Vector R, R0, R1, dβ, dβ0, dβ1;
		Vector β = new Vector(Parameters);
		double λ0, λ, v;
		double SE, SE0, SE1;

		// Initalize Convergence Varibles
		bool steepestDecent = false;
		bool stop = false;
		int interation = 1;
		int maxInterations = 100;
		double convergence = 1;
		List<double> S = new List<double>();
		R = Residuals(X, Y, (double[])β);
		S.Add(R.Norm());

		// Initalize Damping Parameters
		λ0 = 1;
		λ = λ0;
		v = 10;

		while ( convergence > 0.0001                      
		|| (steepestDecent && convergence > 1e-10) 
		&& !stop 
		&& interation < maxInterations)
		{
		// Calcaulte Delta Parameter 
		J = Jacobian(X);
		JtJ = J.T() * J;
		dβ0 = (JtJ + λ * JtJ.Diag()).Inverse() * J.T() * R;         // Update with λ
		dβ1 = (JtJ + (λ / v) * JtJ.Diag()).Inverse() * J.T() * R;   // Update with λ/v

		// Calculate Squared Error of the Residuals
		R0 = Residuals(X, Y, (double[])(β + dβ0));
		R1 = Residuals(X, Y, (double[])(β + dβ1));
		SE0 = R0.Norm();
		SE1 = R1.Norm();

		// Select dβ if it improves the Squared Error
		if (SE0 < SE1 && SE0 < S[S.Count - 1])         // Default λ is best
		{
		steepestDecent = false;
		dβ = dβ0;
		R = R0;
		SE = SE0;
		}
		else if (SE1 < SE0 && SE1 < S[S.Count - 1])    // Decreased λ is best
		{
		steepestDecent = false;
		dβ = dβ1;
		R = R1;
		SE = SE1;
		λ = λ / v;
		}
		else    // Search in Steep Descent Direction
		{       // - Increase damping factor by a factor of v until a better Squared Error is found
		while (SE1 > S[S.Count - 1] && λ < 1e30)
		{
		λ = λ * v;
		dβ1 = (JtJ + λ * JtJ.Diag()).Inverse() * J.T() * R;
		R1 = Residuals(X, Y, (double[])(β + dβ1));
		SE1 = R1.Norm();
		}

		// Couldn't decrease the Squared Error
		if (SE1 >= S[S.Count - 1])
		stop = true;

		steepestDecent = true;
		dβ = dβ1;
		R = R1;
		SE = SE1;
		λ = λ0;
		}

		// Update Model Paramters
		for (int i = 0; i < ParameterCount; i++)
		β[i] = β[i] + dβ[i];

		// Calculate Convergence
		S.Add(R.Norm());
		int k = S.Count - 1;
		convergence = Math.Abs(S[k] - S[k - 1]) / S[k - 1];

		// Increase Interation
		interation++;

		}
		Error = S.ToArray();
		*/
		
	}

}

export default new Regression();
